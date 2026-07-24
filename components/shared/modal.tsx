import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, description, isOpen, onClose, children }: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
