import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IoClose } from 'react-icons/io5';
import {
  modalBackdropVariant,
  modalBodyVariant,
  modalCloseButtonVariant,
  modalContentVariant,
  modalDescriptionVariant,
  modalHeaderTopVariant,
  modalHeaderVariant,
  modalSubtitleVariant,
  modalTitleVariant,
  type ModalContentSize,
} from './modal.css';
import { cn } from '../../utils/cn';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  size?: ModalContentSize;
  children: ReactNode;
}

const CLOSE_ANIMATION_DURATION = 150;

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  size,
  children,
  className,
  ...props
}: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const visibleRef = useRef(false);
  visibleRef.current = visible;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visibleRef.current) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, CLOSE_ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={cn(modalBackdropVariant({ closing }))} onClick={handleClose} {...props}>
      <div
        className={cn(modalContentVariant({ size, closing }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle || description) && (
          <div className={cn(modalHeaderVariant())}>
            <div className={cn(modalHeaderTopVariant())}>
              {title && <p className={cn(modalTitleVariant())}>{title}</p>}
              <button
                type="button"
                className={cn(modalCloseButtonVariant())}
                onClick={handleClose}
                aria-label="닫기"
              >
                <IoClose size={20} color="#808080" />
              </button>
            </div>
            {subtitle && <p className={cn(modalSubtitleVariant())}>{subtitle}</p>}
            {description && <p className={cn(modalDescriptionVariant())}>{description}</p>}
          </div>
        )}
        <div className={cn(modalBodyVariant())}>{children}</div>
      </div>
    </div>
  );
}
