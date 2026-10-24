'use client';

import { useState, useRef, useTransition } from 'react';
import { Camera, Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { uploadAvatarAction } from '@/services/settings/uploadAvatarAction';

interface ProfileAvatarUploaderProps {
  currentAvatarUrl?: string;
  fallbackName: string;
  onAvatarChange?: (url: string) => void;
}

export default function ProfileAvatarUploader({
  currentAvatarUrl = '',
  fallbackName,
  onAvatarChange,
}: ProfileAvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>(currentAvatarUrl);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file format. Please upload an image (PNG, JPEG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum image size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    startTransition(async () => {
      try {
        const result = await uploadAvatarAction(formData);
        if (result.success && result.data) {
          const uploadedUrl = (result.data as { avatarUrl: string }).avatarUrl;
          setAvatarUrl(uploadedUrl);
          onAvatarChange?.(uploadedUrl);
          toast.success('Profile photo uploaded & saved to Cloudinary!');
        } else {
          toast.error(result.message || 'Failed to upload photo to Cloudinary.');
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Upload failed due to network error.'
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  const initialLetter = (fallbackName || 'U').charAt(0).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-border/70 bg-muted/10">
      <div className="relative group">
        <Avatar className="size-20 sm:size-24 border-2 border-primary/20 shadow-xs transition-transform duration-200 group-hover:scale-102">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={fallbackName} className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-primary/10 font-bold text-2xl text-primary">
            {initialLetter}
          </AvatarFallback>
        </Avatar>

        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xs">
            <Loader2 className="size-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center sm:text-left space-y-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Profile Avatar</h4>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP or GIF up to 5MB. Hosted securely on Cloudinary.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileSelection}
            disabled={isPending}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs h-8 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="size-3.5 text-primary" />
                <span>Change Photo</span>
              </>
            )}
          </Button>

          {avatarUrl && (
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <UploadCloud className="size-3 text-emerald-500" />
              <span>Cloudinary Synced</span>
            </span>
          )}
        </div>
      </div>

      {/* Hidden input to pass avatarUrl with form submissions */}
      <input type="hidden" name="avatarUrl" value={avatarUrl} />
    </div>
  );
}

