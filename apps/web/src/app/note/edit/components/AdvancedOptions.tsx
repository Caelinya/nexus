'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Lock,
  Timer,
  Paperclip,
  X,
  Upload,
  FileText,
  File,
  ChevronDown,
  Eye,
  EyeOff,
  Shield,
  Flame,
  Calendar,
  Clock,
  AlertTriangle,
  Image,
  FileArchive,
  FileCode,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdvancedOptionsProps {
  onOptionsChange?: (options: ArticleOptions) => void
}

export interface ArticleOptions {
  password?: string
  destructConfig?: DestructConfig
  attachments?: FileAttachment[]
}

interface DestructConfig {
  mode: 'none' | 'after-read' | 'scheduled' | 'after-read-delay' | 'custom'
  afterReadDelay?: number // minutes after first read
  scheduledTime?: Date
  customRules?: {
    maxReads?: number
    ipWhitelist?: string[]
    requirePassword?: boolean
  }
}

interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

const AFTER_READ_DELAY_OPTIONS = [
  { label: 'Immediately', value: 0 },
  { label: '5 minutes', value: 5 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '24 hours', value: 1440 },
  { label: '7 days', value: 10080 },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const kb = bytes / 1024
  if (kb < 1024) return kb.toFixed(1) + ' KB'
  const mb = kb / 1024
  if (mb < 1024) return mb.toFixed(1) + ' MB'
  return (mb / 1024).toFixed(1) + ' GB'
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return FileArchive
  if (type.includes('javascript') || type.includes('json') || type.includes('html') || type.includes('css')) return FileCode
  return FileText
}

export function AdvancedOptions({ onOptionsChange }: AdvancedOptionsProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [destructConfig, setDestructConfig] = useState<DestructConfig>({ mode: 'none' })
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDestructDialogOpen, setIsDestructDialogOpen] = useState(false)
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handlePasswordSave = () => {
    setIsPasswordDialogOpen(false)
    updateOptions()
  }

  const handlePasswordRemove = () => {
    setPassword('')
    setIsPasswordDialogOpen(false)
    updateOptions()
  }

  const handleDestructSave = () => {
    setIsDestructDialogOpen(false)
    updateOptions()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newAttachments: FileAttachment[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }

    setAttachments([...attachments, ...newAttachments])
    updateOptions()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files) return

    const newAttachments: FileAttachment[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }

    setAttachments([...attachments, ...newAttachments])
    updateOptions()
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id))
    updateOptions()
  }

  const updateOptions = () => {
    onOptionsChange?.({
      password: password || undefined,
      destructConfig: destructConfig.mode !== 'none' ? destructConfig : undefined,
      attachments,
    })
  }

  const getDestructDescription = () => {
    switch (destructConfig.mode) {
      case 'after-read':
        return 'Destroy immediately after reading'
      case 'after-read-delay':
        const delay = destructConfig.afterReadDelay || 0
        if (delay === 0) return 'Destroy immediately after reading'
        const delayOption = AFTER_READ_DELAY_OPTIONS.find(o => o.value === delay)
        return `Destroy ${delayOption?.label.toLowerCase()} after first read`
      case 'scheduled':
        if (destructConfig.scheduledTime) {
          return `Scheduled: ${new Date(destructConfig.scheduledTime).toLocaleString()}`
        }
        return 'Scheduled destruction'
      case 'custom':
        const rules = []
        if (destructConfig.customRules?.maxReads) {
          rules.push(`${destructConfig.customRules.maxReads} reads max`)
        }
        if (destructConfig.customRules?.requirePassword) {
          rules.push('password required')
        }
        return rules.length > 0 ? rules.join(', ') : 'Custom rules'
      default:
        return 'No auto-destruction'
    }
  }

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Advanced Options</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Access Control */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogTrigger asChild>
            <div className={cn(
              "relative group cursor-pointer",
              "border-2 rounded-xl p-5",
              "bg-gradient-to-br from-background to-muted/20",
              "hover:from-primary/5 hover:to-primary/10",
              "transition-all duration-300 hover:scale-[1.02]",
              password && "border-primary/50 shadow-lg shadow-primary/10"
            )}>
              <div className="absolute top-3 right-3">
                {password ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Protected
                  </Badge>
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-gradient-to-br from-primary/10 to-primary/5",
                    "group-hover:from-primary/20 group-hover:to-primary/10"
                  )}>
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  Access Control
                </h4>
                <p className="text-sm text-muted-foreground">
                  {password ? 'Password protection enabled' : 'Secure your article with a password'}
                </p>
              </div>
            </div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Access Control Settings
              </DialogTitle>
              <DialogDescription>
                Protect your article with a password. Readers will need to enter this password to view the content.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="password">Access Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use a strong password to protect sensitive content
                </p>
              </div>
              
              <div className="flex justify-between gap-2 pt-2">
                {password && (
                  <Button 
                    variant="ghost" 
                    onClick={handlePasswordRemove}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove Password
                  </Button>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Self-Destruct */}
        <Dialog open={isDestructDialogOpen} onOpenChange={setIsDestructDialogOpen}>
          <DialogTrigger asChild>
            <div className={cn(
              "relative group cursor-pointer",
              "border-2 rounded-xl p-5",
              "bg-gradient-to-br from-background to-muted/20",
              "hover:from-destructive/5 hover:to-destructive/10",
              "transition-all duration-300 hover:scale-[1.02]",
              destructConfig.mode !== 'none' && "border-destructive/50 shadow-lg shadow-destructive/10"
            )}>
              <div className="absolute top-3 right-3">
                {destructConfig.mode !== 'none' ? (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                    <Flame className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Timer className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-gradient-to-br from-destructive/10 to-destructive/5",
                    "group-hover:from-destructive/20 group-hover:to-destructive/10"
                  )}>
                    <Flame className="h-5 w-5 text-destructive" />
                  </div>
                  Self-Destruct
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getDestructDescription()}
                </p>
              </div>
            </div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-destructive" />
                Self-Destruct Configuration
              </DialogTitle>
              <DialogDescription>
                Configure automatic deletion rules for your article
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 pt-4">
              <Tabs 
                value={destructConfig.mode} 
                onValueChange={(value: any) => setDestructConfig({...destructConfig, mode: value})}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="none">None</TabsTrigger>
                  <TabsTrigger value="after-read">Instant</TabsTrigger>
                  <TabsTrigger value="after-read-delay">Delayed</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="none" className="space-y-4">
                  <div className="text-center py-8">
                    <Timer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Self-Destruct</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Your article will remain accessible indefinitely
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="after-read" className="space-y-4">
                  <div className="text-center py-8">
                    <div className="relative mx-auto w-fit">
                      <Flame className="h-12 w-12 text-destructive" />
                      <Eye className="h-6 w-6 absolute -bottom-1 -right-1 text-destructive" />
                    </div>
                    <h3 className="font-semibold mb-2 mt-4">Destroy After First Read</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Article will be permanently deleted immediately after being viewed for the first time
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4 max-w-md mx-auto">
                      <p className="text-xs text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="after-read-delay" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Clock className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                      <h3 className="font-semibold mb-2">Delayed Destruction After Read</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Article will be deleted after a specified time following the first read
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Delay after first read</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span>
                              {AFTER_READ_DELAY_OPTIONS.find(o => o.value === (destructConfig.afterReadDelay || 30))?.label || 'Select delay'}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                          {AFTER_READ_DELAY_OPTIONS.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() => setDestructConfig({...destructConfig, afterReadDelay: option.value})}
                            >
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="scheduled" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                      <h3 className="font-semibold mb-2">Scheduled Destruction</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Article will be deleted at a specific date and time
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Destruction date and time</Label>
                      <Input
                        type="datetime-local"
                        value={destructConfig.scheduledTime ? new Date(destructConfig.scheduledTime).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setDestructConfig({...destructConfig, scheduledTime: new Date(e.target.value)})}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Select when the article should be automatically deleted
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                      <h3 className="font-semibold mb-2">Custom Rules</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Create advanced destruction rules
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxReads">Maximum number of reads</Label>
                        <Input
                          id="maxReads"
                          type="number"
                          placeholder="e.g., 10"
                          value={destructConfig.customRules?.maxReads || ''}
                          onChange={(e) => setDestructConfig({
                            ...destructConfig,
                            customRules: {
                              ...destructConfig.customRules,
                              maxReads: parseInt(e.target.value) || undefined
                            }
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Delete after this many views (leave empty for unlimited)
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="requirePassword"
                          checked={destructConfig.customRules?.requirePassword || false}
                          onChange={(e) => setDestructConfig({
                            ...destructConfig,
                            customRules: {
                              ...destructConfig.customRules,
                              requirePassword: e.target.checked
                            }
                          })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="requirePassword" className="cursor-pointer">
                          Require password for destruction bypass
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDestructDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleDestructSave}
                  variant={destructConfig.mode !== 'none' ? 'destructive' : 'default'}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Attachments */}
        <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
          <DialogTrigger asChild>
            <div className={cn(
              "relative group cursor-pointer",
              "border-2 rounded-xl p-5",
              "bg-gradient-to-br from-background to-muted/20",
              "hover:from-blue-500/5 hover:to-blue-500/10",
              "transition-all duration-300 hover:scale-[1.02]",
              attachments.length > 0 && "border-blue-500/50 shadow-lg shadow-blue-500/10"
            )}>
              <div className="absolute top-3 right-3">
                {attachments.length > 0 ? (
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    {attachments.length} file{attachments.length > 1 ? 's' : ''}
                  </Badge>
                ) : (
                  <Paperclip className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
                    "group-hover:from-blue-500/20 group-hover:to-blue-500/10"
                  )}>
                    <Paperclip className="h-5 w-5 text-blue-600" />
                  </div>
                  Attachments
                </h4>
                <p className="text-sm text-muted-foreground">
                  {attachments.length > 0 
                    ? `${formatFileSize(attachments.reduce((sum, f) => sum + f.size, 0))} total`
                    : 'Add files to your article'
                  }
                </p>
              </div>
            </div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-blue-600" />
                Manage Attachments
              </DialogTitle>
              <DialogDescription>
                Upload files to include with your article
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              {/* Upload area */}
              <div
                className={cn(
                  "relative overflow-hidden",
                  "border-2 border-dashed rounded-xl p-8",
                  "bg-gradient-to-br from-blue-500/5 to-blue-500/10",
                  "transition-all duration-300",
                  isDragging && "border-blue-500 bg-blue-500/20 scale-[1.02]"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className={cn(
                    "p-4 rounded-full",
                    "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
                    "transition-all duration-300",
                    isDragging && "scale-110"
                  )}>
                    <Upload className={cn(
                      "h-8 w-8 text-blue-600",
                      "transition-all duration-300",
                      isDragging && "animate-bounce"
                    )} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-lg">
                      {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports images, documents, and archives up to 10MB
                    </p>
                  </div>
                </label>
              </div>

              {/* File list */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Uploaded files</h4>
                    <span className="text-sm text-muted-foreground">
                      {attachments.length} file{attachments.length > 1 ? 's' : ''} • {formatFileSize(attachments.reduce((sum, f) => sum + f.size, 0))}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {attachments.map((file) => {
                      const FileIcon = getFileIcon(file.type)
                      return (
                        <div
                          key={file.id}
                          className={cn(
                            "flex items-center justify-between p-3",
                            "border rounded-lg",
                            "hover:bg-muted/50 transition-colors",
                            "group"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              "bg-gradient-to-br from-primary/10 to-primary/5"
                            )}>
                              <FileIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(file.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setIsAttachmentDialogOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
