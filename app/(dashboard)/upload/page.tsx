'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { Cloud, FileUp, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { uploadInvoice } from '@/app/lib/api'
import { SUPPORTED_FILE_TYPES } from '@/app/lib/constants'

export default function UploadPage() {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only PDF files are supported.')
      return false
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return false
    }

    return true
  }

  const handleFile = async (file: File) => {
    if (!validateFile(file)) {
      return
    }

    setUploadedFile(file)
    setIsUploading(true)

    try {
      const response = await uploadInvoice(file)
      console.log('Upload response:', response)
      
      // Backend returns: { confidence, data, dataConfidence, predictionTime }
      const extractedInvoiceId = response.data?.InvoiceId
      const vendorName = response.data?.VendorName
      const confidence = response.confidence ? (response.confidence * 100).toFixed(1) : 'N/A'
      
      if (!extractedInvoiceId || !vendorName) {
        console.error('Missing required fields in response:', response)
        toast.error('Response missing invoice details')
        return
      }
      
      toast.success(
        `✅ Invoice extracted!\n📋 Vendor: ${vendorName}\n🆔 ID: ${extractedInvoiceId}\n📊 Confidence: ${confidence}%`,
        { duration: 5000 }
      )
      setUploadedFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-oracle-950 mb-2">Upload Invoice</h1>
        <p className="text-oracle-600">Upload invoice documents for automatic extraction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClickUpload}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-oracle-500 bg-oracle-50'
                : 'border-oracle-300 bg-white hover:border-oracle-400'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleInputChange}
              disabled={isUploading}
              accept={SUPPORTED_FILE_TYPES.join(',')}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-oracle-100 rounded-full flex items-center justify-center">
                    <div className="w-14 h-14 border-4 border-oracle-200 border-t-oracle-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-oracle-700 font-medium">Uploading and extracting...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Cloud className="text-oracle-400" size={48} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-oracle-900">Drag and drop your file here</p>
                  <p className="text-oracle-600 mt-2">or click to select a file</p>
                </div>
              </div>
            )}
          </div>

          {uploadedFile && !isUploading && (
            <div className="mt-6 p-4 bg-oracle-50 border border-oracle-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileUp className="text-oracle-600" size={24} />
                <div>
                  <p className="font-medium text-oracle-900">{uploadedFile.name}</p>
                  <p className="text-sm text-oracle-600">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div>
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-oracle-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-oracle-600" />
                Supported Formats
              </h3>
              <ul className="space-y-2 text-oracle-600 text-sm">
                <li>✓ PDF (.pdf)</li>
              </ul>
            </div>

            <div className="border-t border-oracle-200 pt-6">
              <h3 className="font-semibold text-oracle-900 mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-oracle-600" />
                Requirements
              </h3>
              <ul className="space-y-2 text-oracle-600 text-sm">
                <li>• Maximum file size: 10 MB</li>
                <li>• Clear, legible document</li>
                <li>• Valid invoice format</li>
              </ul>
            </div>

            <div className="border-t border-oracle-200 pt-6 bg-oracle-50 rounded-lg p-4">
              <p className="text-sm text-oracle-700">
                Your document will be processed automatically and invoice data will be extracted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
