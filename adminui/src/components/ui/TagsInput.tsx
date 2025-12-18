import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

interface TagsInputProps {
  value?: string[];
  onChange: (tags: string[]) => void;
  predefinedTags?: string[];
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  error?: string;
  shouldCreateNew?: boolean;
}

const TagsInput = ({
  value = [],
  onChange,
  predefinedTags,
  label,
  placeholder = "Add custom tag...",
  isRequired,
  shouldCreateNew = false,
  error,
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value?.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTagToggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPredefinedTags = predefinedTags.filter(
    (tag) =>
      !value.includes(tag) &&
      tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  const shouldShowCreateOption =
    inputValue.trim() !== "" &&
    !predefinedTags.includes(inputValue.trim()) &&
    !value.includes(inputValue.trim());

  return (
    <div className="group">
      {label && (
        <label className="block text-base mb-2">
          {label}
          {isRequired && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div className="relative" ref={inputRef}>
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-md disabled:bg-slate-200 disabled:text-slate-500 group-hover:border-gray-500 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:outline-primary"
            }`}
          />
        </div>

        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-[20rem] overflow-y-auto">
            <div className="py-1">
              {shouldCreateNew && shouldShowCreateOption && (
                <button
                  type="button"
                  onClick={handleAddTag}
                  className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                >
                  <span className=" mr-2">Create:</span>
                  <span className="font-medium">"{inputValue.trim()}"</span>
                </button>
              )}

              {/* Predefined tags */}
              {filteredPredefinedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {tag}
                </button>
              ))}

              {/* Empty state */}
              {!shouldShowCreateOption &&
                filteredPredefinedTags.length === 0 && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No matching tags
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Selected tags display */}
      <div className="flex flex-wrap gap-2 mt-2">
        {value?.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center rounded-full p-2 border text-sm transition-colors bg-secondary-dark text-white border-secondary-dark`}
          >
            <span className="px-2">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <IoClose size={18} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <span className="flex items-center text-red-500 text-sm mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default TagsInput;
