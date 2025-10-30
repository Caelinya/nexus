/**
 * Calculate word count from text
 */
export function getWordCount(text: string): number {
  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, '')
  // Match words (handles multiple languages)
  const words = plainText.match(/[\w\u4e00-\u9fa5]+/g)
  return words ? words.length : 0
}

import { EDITOR_CONFIG } from '@/constants/editor'

/**
 * Estimate reading time in minutes
 */
export function getReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / EDITOR_CONFIG.WORDS_PER_MINUTE)
}

/**
 * Calculate file size estimate in bytes
 */
export function getFileSizeEstimate(text: string): number {
  // UTF-8 encoding estimate
  return new Blob([text]).size
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
