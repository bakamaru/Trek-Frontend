import React, { useState } from "react";
import { useGetBookingNotesQuery, useAddBookingNoteMutation, useGetBookingCommunicationLogQuery, useSendBookingEmailMutation } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";
import { MdAdd, MdEmail } from "react-icons/md";

interface NotesTabProps {
    bookingId: number;
}

const NotesTab: React.FC<NotesTabProps> = ({ bookingId }) => {
    const [noteText, setNoteText] = useState("");
    const { data: notesData, refetch: refetchNotes } = useGetBookingNotesQuery(bookingId);
    const { data: commLogData } = useGetBookingCommunicationLogQuery(bookingId);
    const [addNote, { isLoading: isAddingNote }] = useAddBookingNoteMutation();
    const [sendEmail, { isLoading: isSendingEmail }] = useSendBookingEmailMutation();

    const notes = notesData?.data || [];
    const commLog = commLogData?.data || [];

    const handleAddNote = async () => {
        if (!noteText.trim()) {
            toaster.error("Note cannot be empty");
            return;
        }

        try {
            const response: any = await addNote({ bookingId, note: noteText }).unwrap();
            if (response.code === 200) {
                toaster.success("Note added successfully");
                setNoteText("");
                refetchNotes();
            }
        } catch (error) {
            toaster.error("Failed to add note");
        }
    };

    const handleSendEmail = async (emailType: string) => {
        try {
            const response: any = await sendEmail({ bookingId, emailType }).unwrap();
            if (response.code === 200) {
                toaster.success(`${emailType} email sent successfully`);
            }
        } catch (error) {
            toaster.error("Failed to send email");
        }
    };

    return (
        <div className="space-y-6">
            {/* Add Note */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h3>
                <div className="space-y-3">
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Add an internal note (only visible to staff)..."
                    />
                    <button
                        onClick={handleAddNote}
                        disabled={isAddingNote}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 flex items-center gap-2"
                    >
                        <MdAdd size={18} />
                        {isAddingNote ? "Adding..." : "Add Note"}
                    </button>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
                {notes.map((note: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900">{note.createdBy || "Admin"}</div>
                            <div className="text-xs text-gray-500">
                                {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
                            </div>
                        </div>
                        <div className="text-sm text-gray-700">{note.note}</div>
                    </div>
                ))}
            </div>

            {/* Communication Actions */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Email</h3>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => handleSendEmail("confirmation")}
                        disabled={isSendingEmail}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <MdEmail size={18} />
                        Send Confirmation
                    </button>
                    <button
                        onClick={() => handleSendEmail("invoice")}
                        disabled={isSendingEmail}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <MdEmail size={18} />
                        Send Invoice
                    </button>
                    <button
                        onClick={() => handleSendEmail("reminder")}
                        disabled={isSendingEmail}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <MdEmail size={18} />
                        Send Reminder
                    </button>
                </div>
            </div>

            {/* Communication Log */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Log</h3>
                <div className="space-y-2">
                    {commLog.map((log: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                            <div className="text-gray-500 min-w-[140px]">
                                {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}
                            </div>
                            <div className="flex-1 text-gray-700">{log.message}</div>
                        </div>
                    ))}
                    {commLog.length === 0 && (
                        <div className="text-center py-4 text-gray-500">No communication history yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesTab;
