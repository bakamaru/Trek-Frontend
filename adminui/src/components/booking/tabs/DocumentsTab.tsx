import React, { useState } from "react";
import { useGetBookingDocumentsQuery, useUploadBookingDocumentMutation, useDeleteBookingDocumentMutation, useVerifyBookingDocumentMutation } from "../../../redux/trek/bookingAPI";
import toaster from "../../toster";
import { MdUpload, MdDelete, MdCheckCircle, MdDownload } from "react-icons/md";

interface DocumentsTabProps {
    bookingId: number;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ bookingId }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState("PASSPORT");

    const { data: documentsData, refetch } = useGetBookingDocumentsQuery(bookingId);
    const [uploadDocument, { isLoading: isUploading }] = useUploadBookingDocumentMutation();
    const [deleteDocument] = useDeleteBookingDocumentMutation();
    const [verifyDocument] = useVerifyBookingDocumentMutation();

    const documents = documentsData?.data || [];

    const handleUpload = async () => {
        if (!selectedFile) {
            toaster.error("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("documentType", documentType);

        try {
            const response: any = await uploadDocument({ bookingId, formData }).unwrap();
            if (response.code === 200) {
                toaster.success("Document uploaded successfully");
                setSelectedFile(null);
                refetch();
            }
        } catch (error) {
            toaster.error("Failed to upload document");
        }
    };

    const handleDelete = async (documentId: number) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const response: any = await deleteDocument({ bookingId, documentId }).unwrap();
            if (response.code === 200) {
                toaster.success("Document deleted successfully");
                refetch();
            }
        } catch (error) {
            toaster.error("Failed to delete document");
        }
    };

    const handleVerify = async (documentId: number) => {
        try {
            const response: any = await verifyDocument({ bookingId, documentId }).unwrap();
            if (response.code === 200) {
                toaster.success("Document verified successfully");
                refetch();
            }
        } catch (error) {
            toaster.error("Failed to verify document");
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Form */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="PASSPORT">Passport</option>
                                <option value="VISA">Visa</option>
                                <option value="INSURANCE">Insurance</option>
                                <option value="VOUCHER">Voucher</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                            <input
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="w-full text-sm"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 flex items-center gap-2"
                    >
                        <MdUpload size={18} />
                        {isUploading ? "Uploading..." : "Upload Document"}
                    </button>
                </div>
            </div>

            {/* Documents List */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                    {documents.map((doc: any) => (
                        <div key={doc.documentId} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">{doc.fileName || "Document"}</span>
                                        {doc.isVerified && (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                                <MdCheckCircle size={14} />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Type: {doc.documentType} | Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ""}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(doc.fileUrl, "_blank")}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Download"
                                    >
                                        <MdDownload size={18} />
                                    </button>
                                    {!doc.isVerified && (
                                        <button
                                            onClick={() => handleVerify(doc.documentId)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                                            title="Verify"
                                        >
                                            <MdCheckCircle size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(doc.documentId)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {documents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No documents uploaded yet. Upload documents using the form above.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsTab;
