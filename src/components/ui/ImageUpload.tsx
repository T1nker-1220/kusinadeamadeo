import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Loading } from "@/components/ui/Loading"
import { uploadService } from "@/lib/services/upload.service"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  existingUrl?: string
  className?: string
}

export function ImageUpload({
  onUpload,
  onError,
  existingUrl,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(existingUrl || null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const error = uploadService.validateImage(file)
    if (error) {
      onError?.(error)
      return
    }

    try {
      setIsUploading(true)

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Upload file
      const url = await uploadService.uploadProductImage(file)
      onUpload(url)

      // Clean up preview
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed')
      setPreview(existingUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Validate file
    const error = uploadService.validateImage(file)
    if (error) {
      onError?.(error)
      return
    }

    try {
      setIsUploading(true)

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Upload file
      const url = await uploadService.uploadProductImage(file)
      onUpload(url)

      // Clean up preview
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed')
      setPreview(existingUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-surface-secondary transition-colors hover:bg-surface-elevated",
        className
      )}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loading size="lg" />
          <span className="text-sm text-text-secondary">Uploading...</span>
        </div>
      ) : preview ? (
        <div className="relative h-full w-full">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Button variant="ghost" size="sm">
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <svg
            className="h-8 w-8 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <span className="font-medium text-text-primary">
              Click to upload
            </span>{" "}
            <span className="text-text-secondary">
              or drag and drop
            </span>
          </div>
          <p className="text-sm text-text-tertiary">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}
    </div>
  )
} 