import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { nanoid } from "nanoid";



type TaskType =
  | "visit"
  | "login"
  | "click"
  | "fill"
  | "wait_for"
  | "navigate"
  | "extract_table"
  | "extract_text"
  | "return_json";

interface TaskNode {
  id: string;
  type: TaskType;
  label: string;
  config: Record<string, any>;
}

const TASK_LABELS: Record<TaskType, string> = {
  visit: "Visit URL",
  login: "Login",
  click: "Click",
  fill: "Fill",
  wait_for: "Wait For",
  navigate: "Navigate",
  extract_table: "Extract Table",
  extract_text: "Extract Text",
  return_json: "Return JSON",
};

const DEFAULTS: Record<TaskType, Record<string, any>> = {
  visit: { url: "" },
  login: {
    username: { env: "SITE_USERNAME", selector: "input[name='username']" },
    password: { env: "SITE_PASSWORD", selector: "input[name='password']" },
    submit: { selector: "button[type='submit']" },
    postLoginWait: { selector: "", timeoutMs: 15000 },
  },
  navigate: { url: "" },
  wait_for: { selector: "", timeoutMs: 15000 },
  click: { selector: "", nth: undefined as number | undefined },
  fill: { selector: "", value: { value: "" } },
  extract_table: { tableSelector: "table", columnsMode: "header" },
  extract_text: { selector: "", many: false },
  return_json: { select: { columns: [] as string[], limit: undefined as number | undefined } },
};

const PALETTE: TaskType[] = [
  "visit",
  "login",
  "navigate",
  "wait_for",
  "click",
  "fill",
  "extract_table",
  "extract_text",
  "return_json",
];

function cx(...cls: Array<string | false | null | undefined>): string {
  return cls.filter(Boolean).join(" ");
}

function newTask(type: TaskType): TaskNode {
  return { id: nanoid(8), type, label: TASK_LABELS[type], config: structuredClone(DEFAULTS[type]) };
}

function download(filename: string, text: string): void {
  const a = document.createElement("a");
  a.href = "data:text/json;charset=utf-8," + encodeURIComponent(text);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// -----------------------------
// Schema normalization + validation
// -----------------------------

function toRunnerJson(node: TaskNode): any {
  const base: any = { type: node.type };
  switch (node.type) {
    case "visit":
      return { ...base, url: node.config.url || "" };
    case "login":
      return {
        ...base,
        username: {
          ...(node.config.username?.env ? { env: String(node.config.username.env) } : {}),
          ...(node.config.username?.value ? { value: String(node.config.username.value) } : {}),
          selector: node.config.username?.selector || "",
        },
        password: {
          ...(node.config.password?.env ? { env: String(node.config.password.env) } : {}),
          ...(node.config.password?.value ? { value: String(node.config.password.value) } : {}),
          selector: node.config.password?.selector || "",
        },
        submit: { selector: node.config.submit?.selector || "button[type='submit']" },
        postLoginWait: {
          ...(node.config.postLoginWait?.selector ? { selector: node.config.postLoginWait.selector } : {}),
          ...(node.config.postLoginWait?.timeoutMs ? { timeoutMs: Number(node.config.postLoginWait.timeoutMs) } : {}),
        },
      };
    case "navigate":
      return { ...base, url: node.config.url || "" };
    case "wait_for":
      return { ...base, selector: node.config.selector || "", ...(node.config.timeoutMs ? { timeoutMs: Number(node.config.timeoutMs) } : {}) };
    case "click":
      return { ...base, selector: node.config.selector || "", ...(node.config.nth !== undefined && node.config.nth !== "" ? { nth: Number(node.config.nth) } : {}) };
    case "fill":
      return { ...base, selector: node.config.selector || "", value: node.config.value?.env ? { env: String(node.config.value.env) } : { value: String(node.config.value?.value ?? "") } };
    case "extract_table":
      return { ...base, tableSelector: node.config.tableSelector || "table", columnsMode: node.config.columnsMode || "header" };
    case "extract_text":
      return { ...base, selector: node.config.selector || "", many: Boolean(node.config.many) };
    case "return_json": {
      const cols: string[] = (node.config.select?.columns || [])
        .map((c: any) => String(c).trim())
        .filter((c: string) => c.length > 0);
      const sel: any = {};
      if (cols.length) sel.columns = cols;
      const lim = Number(node.config.select?.limit);
      if (!Number.isNaN(lim) && String(node.config.select?.limit ?? "") !== "") sel.limit = lim;
      return Object.keys(sel).length ? { ...base, select: sel } : base;
    }
  }
}

function exportTasks(tasks: TaskNode[]): string {
  return JSON.stringify(tasks.map(toRunnerJson), null, 2);
}

function validateTasks(tasks: TaskNode[]): string[] {
  const errors: string[] = [];
  const isUrl = (v: string) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  };

  tasks.forEach((t, idx) => {
    const path = `Task #${idx + 1} (${t.type})`;
    const cfg = t.config || {};
    switch (t.type) {
      case "visit":
      case "navigate": {
        if (!cfg.url || typeof cfg.url !== "string") errors.push(`${path}: url is required`);
        else if (!isUrl(cfg.url)) errors.push(`${path}: url is not a valid absolute URL`);
        break;
      }
      case "wait_for": {
        if (!cfg.selector) errors.push(`${path}: selector is required`);
        if (cfg.timeoutMs !== undefined && (isNaN(Number(cfg.timeoutMs)) || Number(cfg.timeoutMs) < 0))
          errors.push(`${path}: timeoutMs must be >= 0`);
        break;
      }
      case "click": {
        if (!cfg.selector) errors.push(`${path}: selector is required`);
        if (cfg.nth !== undefined && (isNaN(Number(cfg.nth)) || Number(cfg.nth) < 0)) errors.push(`${path}: nth must be >= 0`);
        break;
      }
      case "fill": {
        if (!cfg.selector) errors.push(`${path}: selector is required`);
        const v = cfg.value || {};
        if (!("env" in v) && !("value" in v)) errors.push(`${path}: provide value.env or value.value`);
        break;
      }
      case "login": {
        const u = cfg.username || {};
        const p = cfg.password || {};
        const s = cfg.submit || {};
        if (!u.selector) errors.push(`${path}: username.selector is required`);
        if (!p.selector) errors.push(`${path}: password.selector is required`);
        if (!s.selector) errors.push(`${path}: submit.selector is required`);
        if (!("env" in u) && !("value" in u)) errors.push(`${path}: username needs env or value`);
        if (!("env" in p) && !("value" in p)) errors.push(`${path}: password needs env or value`);
        const plw = cfg.postLoginWait || {};
        if (plw.timeoutMs !== undefined && (isNaN(Number(plw.timeoutMs)) || Number(plw.timeoutMs) < 0))
          errors.push(`${path}: postLoginWait.timeoutMs must be >= 0`);
        break;
      }
      case "extract_table": {
        if (!cfg.tableSelector) errors.push(`${path}: tableSelector is required`);
        if (!["header", "auto"].includes(cfg.columnsMode))
          errors.push(`${path}: columnsMode must be 'header' or 'auto'`);
        break;
      }
      case "extract_text": {
        if (!cfg.selector) errors.push(`${path}: selector is required`);
        break;
      }
      case "return_json": {
        const sel = cfg.select || {};
        if (sel.limit !== undefined && (isNaN(Number(sel.limit)) || Number(sel.limit) <= 0))
          errors.push(`${path}: select.limit must be > 0`);
        break;
      }
    }
  });

  return errors;
}

// -----------------------------
// react-dnd item types
// -----------------------------

const ItemTypes = {
  TASK: "TASK",
  PALETTE: "PALETTE",
} as const;

// -----------------------------
// Sortable Item (Canvas task) — react-dnd version
// -----------------------------

function SortableTaskItem({
  task,
  index,
  selected,
  onSelect,
  onRemove,
  onMove,
  onInsertPaletteAt,
}: {
  task: TaskNode;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMove: (from: number, to: number) => void;
  onInsertPaletteAt: (taskType: TaskType, atIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TASK,
      item: { id: task.id, index },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [task.id, index]
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.TASK, ItemTypes.PALETTE],
      hover: (item: any, monitor) => {
        if (!ref.current) return;
        const hoverIndex = index;

        if (monitor.getItemType() === ItemTypes.TASK) {
          const dragIndex = item.index as number;
          if (dragIndex === hoverIndex) return;
          const rect = ref.current.getBoundingClientRect();
          const hoverMiddleY = (rect.bottom - rect.top) / 2;
          const clientOffset = monitor.getClientOffset();
          if (!clientOffset) return;
          const hoverClientY = clientOffset.y - rect.top;
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
          onMove(dragIndex, hoverIndex);
          item.index = hoverIndex;
        }
      },
      drop: (item: any, monitor) => {
        if (!ref.current) return;
        if (monitor.getItemType() === ItemTypes.PALETTE) {
          const rect = ref.current.getBoundingClientRect();
          const mid = (rect.bottom - rect.top) / 2;
          const co = monitor.getClientOffset();
          const after = co ? co.y - rect.top > mid : false;
          const at = index + (after ? 1 : 0);
          onInsertPaletteAt(item.taskType as TaskType, at);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }), canDrop: monitor.canDrop() }),
    }),
    [index, onMove, onInsertPaletteAt]
  );

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cx(
        "group flex items-center justify-between rounded-md border p-2 mb-2 bg-white",
        selected && "ring-2 ring-indigo-500",
        isDragging && "opacity-70",
        isOver && canDrop && "outline outline-1 outline-indigo-300"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
        <div>
          <div className="text-[13px] font-semibold leading-5">{TASK_LABELS[task.type]}</div>
          <div className="text-[11px] text-gray-500">type: {task.type}</div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-[11px] rounded-md border px-2 py-1 hover:bg-gray-50"
      >
        Remove
      </button>
    </div>
  );
}

function ListEndDrop({
  onAppendFromPalette,
  onMoveToEnd,
}: {
  onAppendFromPalette: (taskType: TaskType) => void;
  onMoveToEnd: (fromIndex: number) => void;
}) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.PALETTE, ItemTypes.TASK],
      drop: (item: any, monitor) => {
        if (monitor.getItemType() === ItemTypes.PALETTE)
          onAppendFromPalette(item.taskType as TaskType);
        else if (monitor.getItemType() === ItemTypes.TASK)
          onMoveToEnd(item.index as number);
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [onAppendFromPalette, onMoveToEnd]
  );
  return (
    <div
      ref={(node) => {
        if (node) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          drop(node);
        }
      }}
      // ref={drop}
      className={cx(
        "mt-1 h-8 rounded-md border-2 border-dashed flex items-center justify-center text-[11px] text-gray-400",
        isOver && "border-indigo-300 bg-indigo-50/50 text-indigo-600"
      )}
    >
      Drop here to append
    </div>
  );
}

// -----------------------------
// Palette item (draggable)
// -----------------------------

function PaletteItemDraggable({ type }: { type: TaskType }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.PALETTE,
      item: { taskType: type },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [type]
  );
  return (
    <div
      //ref={drag}
      ref={(node) => {
        if (node) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          drag(node);
        }
      }}
      className={cx(
        "cursor-grab active:cursor-grabbing rounded-md border px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 flex items-center justify-between",
        isDragging && "opacity-60"
      )}
    >
      <span>{TASK_LABELS[type]}</span>
      <span className="text-[11px] text-gray-500">{type}</span>
    </div>
  );
}

// -----------------------------
// Canvas shell (for styling) — we handle drops on rows/end only
// -----------------------------

function CanvasShell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border-2 border-dashed p-3 min-h-[180px] flex flex-col">{children}</div>;
}

// When list is empty, provide a real droppable to create the first task
function EmptyCanvasDrop({ onCreateFromPalette }: { onCreateFromPalette: (taskType: TaskType) => void }) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.PALETTE],
      drop: (item: any) => onCreateFromPalette(item.taskType as TaskType),
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [onCreateFromPalette]
  );
  return (
    <div
      //ref={drop}
      ref={(node) => {
        if (node) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          drop(node);
        }
      }}
      className={cx(
        "flex-1 min-h-[220px] rounded-md border-2 border-dashed text-sm text-gray-400 flex items-center justify-center",
        isOver && "border-indigo-300 bg-indigo-50/50 text-indigo-600"
      )}
    >
      Drag a task here to create your workflow
    </div>
  );
}

// -----------------------------
// Field helpers
// -----------------------------

function FieldRow({ label, children, help }: { label: string; children: React.ReactNode; help?: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>
      {children}
      {help && <div className="text-[11px] text-gray-500 mt-1">{help}</div>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: any; onChange: (v: any) => void; placeholder?: string; type?: string }) {
  return (
    <input
      className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      value={value ?? ""}
      onChange={(e) => onChange(type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
      placeholder={placeholder}
      type={type}
    />
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cx("inline-flex h-6 w-11 items-center rounded-full transition", checked ? "bg-indigo-600" : "bg-gray-300")}
      type="button"
    >
      <span className={cx("h-5 w-5 transform rounded-full bg-white transition", checked ? "translate-x-5" : "translate-x-1")} />
    </button>
  );
}

function Editor({ task, onChange }: { task: TaskNode | null; onChange: (t: TaskNode) => void }) {
  if (!task) return <div className="text-gray-400 text-sm">Select a task to edit its settings.</div>;

  const update = (path: string, value: any) => {
    const next: TaskNode = { ...task, config: structuredClone(task.config) };
    const keys = path.split(".");
    let cur: any = next.config;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      cur[k] = cur[k] ?? {};
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = value;
    onChange(next);
  };

  const cfg = task.config;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold mb-2">{TASK_LABELS[task.type]}</div>
        <div className="text-xs text-gray-500">ID: {task.id}</div>
      </div>

      {task.type === "visit" && (
        <FieldRow label="URL">
          <Input value={cfg.url} onChange={(v) => update("url", v)} placeholder="https://..." />
        </FieldRow>
      )}

      {task.type === "navigate" && (
        <FieldRow label="URL">
          <Input value={cfg.url} onChange={(v) => update("url", v)} placeholder="https://..." />
        </FieldRow>
      )}

      {task.type === "wait_for" && (
        <>
          <FieldRow label="Selector">
            <Input value={cfg.selector} onChange={(v) => update("selector", v)} placeholder=".dashboard, table, #app" />
          </FieldRow>
          <FieldRow label="Timeout (ms)">
            <Input type="number" value={cfg.timeoutMs} onChange={(v) => update("timeoutMs", v)} placeholder="15000" />
          </FieldRow>
        </>
      )}

      {task.type === "click" && (
        <>
          <FieldRow label="Selector">
            <Input value={cfg.selector} onChange={(v) => update("selector", v)} placeholder="button[type='submit']" />
          </FieldRow>
          <FieldRow label="nth (optional)">
            <Input type="number" value={cfg.nth} onChange={(v) => update("nth", v)} placeholder="0" />
          </FieldRow>
        </>
      )}

      {task.type === "fill" && (
        <>
          <FieldRow label="Selector">
            <Input value={cfg.selector} onChange={(v) => update("selector", v)} placeholder="input[name='q']" />
          </FieldRow>
          <div className="rounded-xl border p-3">
            <div className="text-xs font-medium mb-2">Value</div>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="env">
                <Input value={cfg.value?.env ?? ""} onChange={(v) => update("value.env", v)} placeholder="SITE_USERNAME" />
              </FieldRow>
              <FieldRow label="value">
                <Input value={cfg.value?.value ?? ""} onChange={(v) => update("value.value", v)} placeholder="literal value" />
              </FieldRow>
            </div>
            <div className="text-[11px] text-gray-500">
              If <b>env</b> is set, it will be used. Otherwise <b>value</b> is used.
            </div>
          </div>
        </>
      )}

      {task.type === "login" && (
        <>
          <div className="rounded-xl border p-3">
            <div className="text-xs font-semibold mb-2">Username</div>
            <FieldRow label="Selector">
              <Input value={cfg.username?.selector} onChange={(v) => update("username.selector", v)} placeholder="input[name='username']" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="env">
                <Input value={cfg.username?.env ?? ""} onChange={(v) => update("username.env", v)} placeholder="SITE_USERNAME" />
              </FieldRow>
              <FieldRow label="value">
                <Input value={cfg.username?.value ?? ""} onChange={(v) => update("username.value", v)} placeholder="literal username" />
              </FieldRow>
            </div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs font-semibold mb-2">Password</div>
            <FieldRow label="Selector">
              <Input value={cfg.password?.selector} onChange={(v) => update("password.selector", v)} placeholder="input[name='password']" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="env">
                <Input value={cfg.password?.env ?? ""} onChange={(v) => update("password.env", v)} placeholder="SITE_PASSWORD" />
              </FieldRow>
              <FieldRow label="value">
                <Input value={cfg.password?.value ?? ""} onChange={(v) => update("password.value", v)} placeholder="literal password" />
              </FieldRow>
            </div>
          </div>
          <FieldRow label="Submit selector">
            <Input value={cfg.submit?.selector} onChange={(v) => update("submit.selector", v)} placeholder="button[type='submit']" />
          </FieldRow>
          <div className="rounded-xl border p-3">
            <div className="text-xs font-semibold mb-2">Post Login Wait</div>
            <FieldRow label="Selector">
              <Input value={cfg.postLoginWait?.selector} onChange={(v) => update("postLoginWait.selector", v)} placeholder="nav, .dashboard" />
            </FieldRow>
            <FieldRow label="Timeout (ms)">
              <Input type="number" value={cfg.postLoginWait?.timeoutMs} onChange={(v) => update("postLoginWait.timeoutMs", v)} placeholder="15000" />
            </FieldRow>
          </div>
        </>
      )}

      {task.type === "extract_table" && (
        <>
          <FieldRow label="Table selector">
            <Input value={cfg.tableSelector} onChange={(v) => update("tableSelector", v)} placeholder="table.report" />
          </FieldRow>
          <FieldRow label="Columns mode">
            <select
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={cfg.columnsMode}
              onChange={(e) => update("columnsMode", e.target.value)}
            >
              <option value="header">header</option>
              <option value="auto">auto</option>
            </select>
          </FieldRow>
        </>
      )}

      {task.type === "extract_text" && (
        <>
          <FieldRow label="Selector">
            <Input value={cfg.selector} onChange={(v) => update("selector", v)} placeholder="h1.title" />
          </FieldRow>
          <FieldRow label="Many">
            <Switch checked={!!cfg.many} onChange={(v) => update("many", v)} />
          </FieldRow>
        </>
      )}

      {task.type === "return_json" && (
        <>
          <div className="rounded-xl border p-3">
            <div className="text-xs font-semibold mb-2">Select Projection (optional)</div>
            <FieldRow label="Columns (comma-separated)">
              <Input
                value={(cfg.select?.columns || []).join(", ")}
                onChange={(v) =>
                  update(
                    "select.columns",
                    String(v)
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Name, Total, Status"
              />
            </FieldRow>
            <FieldRow label="Limit (optional)">
              <Input type="number" value={cfg.select?.limit} onChange={(v) => update("select.limit", v)} placeholder="10" />
            </FieldRow>
          </div>
        </>
      )}
    </div>
  );
}

// -----------------------------
// Main Page Component
// -----------------------------

export default function TaskBuilderPage(): JSX.Element {
  const [tasks, setTasks] = useState<TaskNode[]>(() => {
    const saved = localStorage.getItem("taskbuilder.state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { }
    }
    return [];
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState<string>(() => localStorage.getItem("taskbuilder.endpoint") || "/api/run");
  const [previewResult, setPreviewResult] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("taskbuilder.state", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("taskbuilder.endpoint", endpoint);
  }, [endpoint]);

  const selected = useMemo(() => tasks.find((t) => t.id === selectedId) || null, [tasks, selectedId]);

  const addTask = useCallback((type: TaskType, idx?: number) => {
    const t = newTask(type);
    setTasks((curr) => {
      const next = [...curr];
      if (typeof idx === "number" && idx >= 0 && idx <= curr.length) next.splice(idx, 0, t);
      else next.push(t);
      return next;
    });
    setSelectedId(t.id);
  }, []);

  const moveTask = useCallback((from: number, to: number) => {
    setTasks((curr) => {
      const next = [...curr];
      const [sp] = next.splice(from, 1);
      next.splice(to, 0, sp);
      return next;
    });
  }, []);

  const moveTaskToEnd = useCallback((from: number) => {
    setTasks((curr) => {
      const next = [...curr];
      const [sp] = next.splice(from, 1);
      next.push(sp);
      return next;
    });
  }, []);

  const removeTask = (id: string) => {
    setTasks((curr) => curr.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const updateTask = (next: TaskNode) => setTasks((curr) => curr.map((t) => (t.id === next.id ? next : t)));

  const exportJson = () => {
    const errs = validateTasks(tasks);
    setErrors(errs);
    if (errs.length) return; // block save
    download("tasks.json", exportTasks(tasks));
  };

  const runPreview = async () => {
    const errs = validateTasks(tasks);
    setErrors(errs);
    if (errs.length) return; // block preview
    setPreviewResult("Running preview…");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: exportTasks(tasks),
      });
      const text = await res.text();
      setPreviewResult(text || "<empty response>");
    } catch (err: any) {
      setPreviewResult(
        `Request failed: ${err?.message || String(err)}\n\nIf you don't have a backend yet, click ‘Generate JSON’ and run it with your .NET runner.`
      );
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">Task Builder</div>
            <span className="text-xs text-gray-500">Browser based agent</span>
          </div>
          <div className="flex items-center gap-2">

            <button onClick={() => setTasks([])} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
              New
            </button>
            <button onClick={exportJson} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
              Save Workflow
            </button>
            <button
              onClick={runPreview}
              className="rounded-md bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700 shadow"
            >
              Test Run
            </button>
          </div>
        </div>
      </div>

      {/* Validation errors */}
      {!!errors.length && (
        <div className="mx-auto max-w-7xl px-4 pt-3">
          <div className="rounded-md border border-red-200 bg-red-50 text-red-800 p-3 text-sm">
            <div className="font-semibold mb-1">Fix these before saving:</div>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* DnD provider wraps palette + canvas + editor */}
      <DndProvider backend={HTML5Backend}>
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-4">
          {/* Palette */}
          <div className="col-span-12 md:col-span-3">
            <div className="rounded-xl border bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold mb-2">Task Palette</div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {PALETTE.map((t) => (
                  <PaletteItemDraggable key={t} type={t} />
                ))}
              </div>
              <div className="text-[11px] text-gray-500 mt-3">
                Drag tasks into the canvas. Click a task there to edit.
              </div>
            </div>

            {/* Preview output */}
            <div className="rounded-xl border bg-white p-3 shadow-sm mt-4">
              <div className="text-sm font-semibold mb-2">Preview Output</div>
              <pre className="text-xs whitespace-pre-wrap max-h-64 overflow-auto bg-gray-50 p-2 rounded-md">
                {previewResult || "No preview yet."}
              </pre>
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-12 md:col-span-5">
            <div className="rounded-xl border bg-white p-4 shadow-sm min-h-[420px]">
              <div className="text-sm font-semibold mb-3">Workflow</div>

              <CanvasShell>
                {tasks.length === 0 && (
                  <EmptyCanvasDrop onCreateFromPalette={(tt) => addTask(tt, 0)} />
                )}

                {tasks.map((t, i) => (
                  <SortableTaskItem
                    key={t.id}
                    task={t}
                    index={i}
                    selected={selectedId === t.id}
                    onSelect={() => setSelectedId(t.id)}
                    onRemove={() => removeTask(t.id)}
                    onMove={moveTask}
                    onInsertPaletteAt={(tt, atIndex) => addTask(tt, atIndex)}
                  />
                ))}

                {/* End drop zone: append / move to end */}
                {tasks.length > 0 && (
                  <ListEndDrop onAppendFromPalette={(tt) => addTask(tt)} onMoveToEnd={moveTaskToEnd} />
                )}
              </CanvasShell>

              {/* Export JSON live view */}
              <div className="mt-4">
                <div className="text-xs font-medium text-gray-600 mb-1">task.json (live)</div>
                <pre className="text-xs bg-gray-50 rounded-md p-2 max-h-64 overflow-auto">{exportTasks(tasks)}</pre>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-12 md:col-span-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm min-h-[420px]">
              <div className="text-sm font-semibold mb-3">Task Settings</div>
              <Editor task={selected} onChange={updateTask} />
            </div>
          </div>
        </div>
      </DndProvider>


    </div>
  );
}

// -----------------------------
// Lightweight runtime tests (dev only)
// -----------------------------

function __test_toRunnerJson(): void {
  const sample: TaskNode[] = [
    { id: "a", type: "visit", label: "Visit URL", config: { url: "https://example.com" } },
    { id: "b", type: "return_json", label: "Return JSON", config: { select: { columns: ["Name"], limit: 5 } } },
  ];
  const json = exportTasks(sample);
  try {
    const arr = JSON.parse(json);
    console.assert(Array.isArray(arr) && arr.length === 2, "Export should produce array of 2");
    console.assert(
      arr[0].type === "visit" && arr[0].url === "https://example.com",
      "Visit should serialize correctly"
    );
    console.assert(
      arr[1].type === "return_json" && arr[1].select.columns[0] === "Name",
      "Projection should serialize correctly"
    );

    // Additional tests
    const waitNode: TaskNode = {
      id: "w1",
      type: "wait_for",
      label: "Wait",
      config: { selector: ".app", timeoutMs: 5000 },
    };
    const waitJson = toRunnerJson(waitNode);
    console.assert(
      waitJson.type === "wait_for" && waitJson.selector === ".app" && waitJson.timeoutMs === 5000,
      "wait_for should serialize"
    );

    const fillEnvNode: TaskNode = {
      id: "f1",
      type: "fill",
      label: "Fill",
      config: { selector: "input[name='q']", value: { env: "QUERY" } },
    };
    const fillEnvJson = toRunnerJson(fillEnvNode);
    console.assert(fillEnvJson.value.env === "QUERY", "fill env should serialize");

    const clickNode: TaskNode = {
      id: "c1",
      type: "click",
      label: "Click",
      config: { selector: "button", nth: 0 },
    };
    const clickJson = toRunnerJson(clickNode);
    console.assert(
      clickJson.selector === "button" && clickJson.nth === 0,
      "click nth should serialize"
    );

    // Login task test
    const loginNode: TaskNode = {
      id: "c",
      type: "login",
      label: "Login",
      config: {
        username: { env: "SITE_USERNAME", selector: "input[name='u']" },
        password: { env: "SITE_PASSWORD", selector: "input[name='p']" },
        submit: { selector: "button[type='submit']" },
      },
    };
    const loginJson = toRunnerJson(loginNode);
    console.assert(
      loginJson.username.env === "SITE_USERNAME" && loginJson.password.env === "SITE_PASSWORD",
      "Login envs should pass through"
    );

    // Validation tests
    const errs1 = validateTasks([
      { id: "x1", type: "visit", label: "Visit", config: { url: "" } } as TaskNode,
    ]);
    console.assert(
      errs1.length === 1 && /url is required/.test(errs1[0]),
      "Visit with empty URL should error"
    );

    const errs2 = validateTasks([
      { id: "x2", type: "fill", label: "Fill", config: { selector: "#q", value: {} } } as TaskNode,
    ]);
    console.assert(
      errs2.length === 1 && /provide value\.env or value\.value/.test(errs2[0]),
      "Fill without value should error"
    );

    // Extra: invalid columnsMode
    const errs3 = validateTasks([
      { id: "x3", type: "extract_table", label: "ET", config: { tableSelector: "table", columnsMode: "bad" } } as any,
    ]);
    console.assert(
      errs3.length === 1 && /columnsMode must be 'header' or 'auto'/.test(errs3[0]),
      "extract_table invalid columnsMode should error"
    );
  } catch (e) {
    console.warn("Task Builder tests failed:", e);
  }
}

if (typeof window !== "undefined" && (import.meta as any)?.env?.MODE !== "production") {
  __test_toRunnerJson();
}
