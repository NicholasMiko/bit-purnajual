export function formatFileSize(sizeInBytes: number): string {
  if (!sizeInBytes || sizeInBytes < 0) return '0 KB'

  const sizeInKb = sizeInBytes / 1024
  if (sizeInKb < 1024) return `${sizeInKb.toFixed(1)} KB`

  return `${(sizeInKb / 1024).toFixed(1)} MB`
}