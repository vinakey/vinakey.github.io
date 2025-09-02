import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { useTheme } from "@heroui/use-theme";
import EmojiPicker, {
  Theme as EmojiTheme,
  EmojiStyle,
  type EmojiClickData,
} from "emoji-picker-react";

import { vietnameseInput, InputMethod } from "@/utils/vietnamese-input";

// Extend window object to include OverType
declare global {
  interface Window {
    OverType: {
      new (target: string | Element, options?: any): any[];
      setTheme: (theme: string) => void;
      getInstance: (element: Element) => any;
      destroyAll: () => void;
    };
  }
}

interface EditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export default function Editor({
  initialContent = "",
  onContentChange,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializingRef = useRef<boolean>(true);
  const [inputMethod, setInputMethod] = useState<InputMethod>("AUTO");
  const [isVietnameseEnabled, setIsVietnameseEnabled] = useState(true);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState("vinakey-document");
  const { theme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<{
    left: number;
    top: number;
    bottom: number;
  } | null>(null);

  // Responsive breakpoint detection for compact emoji modal
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  // Check if user is visiting for the first time
  const isFirstVisit = false;

  // Debug: Track theme state
  useEffect(() => {
    console.log(`Current HeroUI theme: ${theme}`);
  }, [theme]);

  useEffect(() => {
    const initializeEditor = () => {
      if (editorRef.current && window.OverType) {
        try {
          // Initialize OverType editor using the default export
          const OverTypeClass =
            (window.OverType as any).default || window.OverType;
          const sampleContent = `# Chào mừng đến với Vin⭐Key!

## Hướng dẫn sử dụng

1. **Chọn kiểu gõ**: OFF, AUTO, TELEX, VNI, hoặc VIQR
2. **Bắt đầu gõ**: Thử gõ "xin chao" hoặc "cam on ban"  
3. **Sử dụng markdown**: **in đậm**, *in nghiêng*, [liên kết](https://example.com)
4. **Xóa nội dung này** và bắt đầu viết!

> **Ví dụ**: Hãy thử gõ "Toi yeu Viet Nam" với TELEX!`;

          const instances = new OverTypeClass(editorRef.current, {
            value: initialContent || (isFirstVisit ? sampleContent : ""),
            placeholder: "Bắt đầu viết markdown với tiếng Việt...",
            toolbar: true,
            theme: theme === "dark" ? "cave" : "solar",
            fontSize: "16px",
            padding: "24px",
            autoResize: true,
            minHeight: "600px",
            onChange: (value: string) => {
              setContent(value);
              onContentChange?.(value);
            },
          });

          // Sync OverType theme with site theme (instance API)
          try {
            const inst = Array.isArray(instances) ? instances[0] : instances;

            if (inst && typeof inst.setTheme === "function") {
              inst.setTheme(theme === "dark" ? "cave" : "solar");
            }
          } catch {}

          if (instances && instances.length > 0) {
            const instance = instances[0];

            setEditorInstance(instance);

            // Ensure React state mirrors editor initial value
            const initialValue =
              initialContent || (isFirstVisit ? sampleContent : "");

            setContent(initialValue);

            // Helper to attach listeners to the textarea when present
            const tryAttachTextarea = () => {
              const textarea = editorRef.current?.querySelector(
                "textarea",
              ) as HTMLTextAreaElement | null;

              if (!textarea) return false;

              // Mirror textarea input → React state
              const handleInput = () => {
                try {
                  const currentValue = textarea.value;

                  setContent(currentValue);
                } catch {}
              };

              (textarea as any)._vinakeyHandleInput = handleInput;
              textarea.addEventListener("input", handleInput);

              // Attach Vietnamese input
              vietnameseInput.attach(textarea);
              console.log("✓ Vietnamese input attached to textarea");

              // Initialization complete
              isInitializingRef.current = false;

              return true;
            };

            // Attempt immediate attach, else observe for textarea insertion
            if (!tryAttachTextarea()) {
              const observer = new MutationObserver(() => {
                if (tryAttachTextarea()) {
                  observer.disconnect();
                }
              });

              if (editorRef.current) {
                observer.observe(editorRef.current, {
                  childList: true,
                  subtree: true,
                });
              }
              // Safety cutoff in case of never attaching
              setTimeout(() => observer.disconnect(), 3000);
            }

            return () => {
              const textarea = editorRef.current?.querySelector("textarea");

              if (textarea) {
                vietnameseInput.detach(textarea as HTMLTextAreaElement);
                try {
                  const handler = (textarea as any)._vinakeyHandleInput;

                  if (handler) textarea.removeEventListener("input", handler);
                } catch {}
              }
              instance?.destroy();
            };
          }
        } catch (error) {
          console.error("Error initializing OverType:", error);
        }
      }
    };

    // Wait for OverType to be available
    if (window.OverType) {
      return initializeEditor();
    } else {
      // Poll for OverType availability
      const checkOverType = setInterval(() => {
        if (window.OverType) {
          clearInterval(checkOverType);
          initializeEditor();
        }
      }, 100);

      return () => clearInterval(checkOverType);
    }
  }, [initialContent, onContentChange]);

  // Removed offline persistence logic

  useEffect(() => {
    vietnameseInput.setMethod(inputMethod);
    vietnameseInput.setEnabled(isVietnameseEnabled);
  }, [inputMethod, isVietnameseEnabled]);

  // Handle theme changes for OverType editor
  useEffect(() => {
    try {
      if (editorInstance && typeof editorInstance.setTheme === "function") {
        editorInstance.setTheme(theme === "dark" ? "cave" : "solar");
      }
    } catch {}
  }, [theme, editorInstance]);

  const handleMethodChange = (method: InputMethod) => {
    setInputMethod(method);
  };

  const handleOffClick = () => {
    setIsVietnameseEnabled(false);
    setInputMethod("AUTO"); // Reset to AUTO when turning off
  };

  const handleClear = () => {
    if (editorInstance) {
      editorInstance.setValue("");
      setContent("");
    }
    // No offline persistence to clear
  };

  const insertAtCaret = (text: string) => {
    const textarea = editorRef.current?.querySelector(
      "textarea",
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const value = textarea.value;
    const newValue = value.slice(0, start) + text + value.slice(end);
    const newPos = start + text.length;

    textarea.value = newValue;
    textarea.setSelectionRange(newPos, newPos);
    setContent(newValue);
    onContentChange?.(newValue);
    const inputEvent = new Event("input", { bubbles: true });

    (inputEvent as any)._vietnameseProcessed = true;
    textarea.dispatchEvent(inputEvent);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    insertAtCaret(emojiData.emoji);
    setShowEmoji(false);
  };

  const handleCopy = async () => {
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        // Could add a toast notification here
        console.log("Content copied to clipboard");
      } catch (err) {
        console.error("Failed to copy content:", err);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();

      if (editorInstance && clipboardText) {
        editorInstance.setValue(clipboardText);
        setContent(clipboardText);
        console.log("Content pasted from clipboard");
        // No offline persistence
      }
    } catch (err) {
      console.error("Failed to paste content:", err);
    }
  };

  const handleDownload = () => {
    if (content) {
      onOpen(); // Open modal for filename input
    }
  };

  const handleConfirmDownload = () => {
    const finalFilename = filename.trim() || "vinakey-document";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${finalFilename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`Content downloaded as ${finalFilename}.md`);
    onOpenChange(); // Close modal
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Consolidated card with controls and editor */}
      <div className="mb-8">
        <Card>
          {/* Control bar at the top */}
          <CardBody className="!flex !flex-col sm:!flex-row !items-stretch sm:!items-center !gap-2 !p-3 !border-b !border-divider">
            {/* First row: Vietnamese input controls */}
            <div className="!flex !flex-row !flex-nowrap !items-center !justify-start !gap-2 !overflow-x-auto">
              <Button
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                color={!isVietnameseEnabled ? "danger" : "default"}
                size="sm"
                variant={!isVietnameseEnabled ? "solid" : "bordered"}
                onClick={handleOffClick}
              >
                OFF
              </Button>
              {(["AUTO", "TELEX", "VNI", "VIQR"] as InputMethod[]).map(
                (method) => (
                  <Button
                    key={method}
                    className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                    color={
                      inputMethod === method && isVietnameseEnabled
                        ? "primary"
                        : "default"
                    }
                    size="sm"
                    variant={
                      inputMethod === method && isVietnameseEnabled
                        ? "solid"
                        : "bordered"
                    }
                    onClick={() => {
                      handleMethodChange(method);
                      if (!isVietnameseEnabled) {
                        setIsVietnameseEnabled(true);
                      }
                    }}
                  >
                    {method}
                  </Button>
                ),
              )}
            </div>

            {/* Second row: Action buttons (hidden on small screens when in single row, shown on mobile) */}
            <div className="!flex !flex-row !items-center !justify-start sm:!justify-end !gap-2 sm:!flex-grow !flex-wrap">
              <div>
                <Button
                  ref={emojiBtnRef}
                  className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                  color="default"
                  size="sm"
                  variant="bordered"
                  onClick={() => {
                    const rect = emojiBtnRef.current?.getBoundingClientRect();

                    if (rect)
                      setEmojiAnchor({
                        left: rect.left,
                        top: rect.top,
                        bottom: rect.bottom,
                      });
                    setShowEmoji((v) => !v);
                  }}
                >
                  😀
                </Button>
                {showEmoji && emojiAnchor ? (
                  <>
                    <button
                      aria-label="Close emoji picker overlay"
                      className="fixed inset-0 z-[2147483000]"
                      type="button"
                      onClick={() => setShowEmoji(false)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Escape" ||
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          setShowEmoji(false);
                        }
                      }}
                    />
                    <div
                      className="fixed z-[2147483001]"
                      style={{
                        left: Math.max(
                          8,
                          Math.min(
                            emojiAnchor.left,
                            window.innerWidth - 360 - 8,
                          ),
                        ),
                        top: emojiAnchor.bottom + 8,
                      }}
                    >
                      <div
                        className="shadow-medium rounded-medium border border-divider bg-content1 p-1"
                        style={{ maxWidth: 360 }}
                      >
                        <EmojiPicker
                          autoFocusSearch={false}
                          emojiStyle={EmojiStyle.GOOGLE}
                          height={isMobile ? 320 : 420}
                          lazyLoadEmojis={true}
                          previewConfig={{ showPreview: false }}
                          theme={
                            theme === "dark"
                              ? EmojiTheme.DARK
                              : EmojiTheme.LIGHT
                          }
                          width={isMobile ? 280 : 320}
                          onEmojiClick={handleEmojiClick}
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <Button
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                color="warning"
                size="sm"
                variant="bordered"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                color="primary"
                disabled={!content}
                size="sm"
                variant="bordered"
                onClick={handleCopy}
              >
                Copy
              </Button>
              <Button
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                color="secondary"
                size="sm"
                variant="bordered"
                onClick={handlePaste}
              >
                Paste
              </Button>
              <Button
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                color="success"
                disabled={!content}
                size="sm"
                variant="bordered"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </CardBody>

          {/* Editor container */}
          <div
            ref={editorRef}
            className="min-h-[600px] w-full"
            data-testid="editor-container"
            style={{ height: "auto" }}
          />
        </Card>
      </div>

      {/* Download filename modal */}
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Download File
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-500 mb-3">
                  Enter a filename for your markdown document:
                </p>
                <Input
                  // autoFocus - disabled for accessibility
                  description="The file will be saved as .md format"
                  label="Filename"
                  placeholder="vinakey-document"
                  value={filename}
                  variant="bordered"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmDownload();
                    }
                  }}
                  onValueChange={setFilename}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleConfirmDownload}>
                  Download
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
