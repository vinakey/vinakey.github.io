import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useTheme } from "@heroui/use-theme";

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
  const [inputMethod, setInputMethod] = useState<InputMethod>("AUTO");
  const [isVietnameseEnabled, setIsVietnameseEnabled] = useState(true);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState("vinakey-document");
  const { theme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Check if user is visiting for the first time
  const isFirstVisit = !localStorage.getItem("vinakey2-visited");

  // Modern and elegant custom theme configuration
  const customTheme = {
    name: 'vinakey-modern',
    colors: {
      bgPrimary: theme === 'dark' ? '#0f0f23' : '#fefefe',
      bgSecondary: theme === 'dark' ? '#1a1a2e' : '#f8fafc',
      text: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      h1: theme === 'dark' ? '#f97316' : '#f97316', // Orange primary for both themes
      h2: theme === 'dark' ? '#fb923c' : '#ea580c', // Orange variants
      h3: theme === 'dark' ? '#fdba74' : '#c2410c', 
      strong: theme === 'dark' ? '#fb923c' : '#ea580c',
      em: theme === 'dark' ? '#f97316' : '#f97316',
      link: theme === 'dark' ? '#60a5fa' : '#2563eb', // Modern blue
      code: theme === 'dark' ? '#a78bfa' : '#7c3aed', // Modern purple
      codeBg: theme === 'dark' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(249, 115, 22, 0.1)',
      blockquote: theme === 'dark' ? '#64748b' : '#475569', // Modern gray
      hr: theme === 'dark' ? '#374151' : '#d1d5db',
      syntaxMarker: theme === 'dark' ? 'rgba(226, 232, 240, 0.4)' : 'rgba(30, 41, 59, 0.4)',
      cursor: '#f97316', // Orange cursor for both themes
      selection: theme === 'dark' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)'
    }
  };

  useEffect(() => {
    const initializeEditor = () => {
      if (editorRef.current && window.OverType) {
        try {
          // Initialize OverType editor using the default export
          const OverTypeClass =
            (window.OverType as any).default || window.OverType;
          const sampleContent = `# Chào mừng đến với VinKey!

## Hướng dẫn sử dụng

1. **Chọn kiểu gõ**: OFF, AUTO, TELEX, VNI, hoặc VIQR
2. **Bắt đầu gõ**: Thử gõ "xin chao" hoặc "cam on ban"  
3. **Sử dụng markdown**: **in đậm**, *in nghiêng*, [liên kết](https://example.com)
4. **Xóa nội dung này** và bắt đầu viết!

> **Ví dụ**: Hãy thử gõ "Toi yeu Viet Nam" với TELEX!`;

          const instances = new OverTypeClass(editorRef.current, {
            value: isFirstVisit ? sampleContent : initialContent,
            placeholder: "Bắt đầu viết markdown với tiếng Việt...",
            toolbar: true,
            theme: customTheme,
            fontSize: "16px",
            padding: "24px",
            autoResize: true,
            minHeight: "600px",
            onChange: (value: string) => {
              setContent(value);
              onContentChange?.(value);
            },
          });

          if (instances && instances.length > 0) {
            const instance = instances[0];
            setEditorInstance(instance);

            // Mark user as visited and set initial content
            if (isFirstVisit) {
              localStorage.setItem("vinakey2-visited", "true");
              setContent(sampleContent);
            }

            // Get the textarea element from OverType and attach Vietnamese input
            setTimeout(() => {
              const textarea = editorRef.current?.querySelector("textarea");

              if (textarea) {
                vietnameseInput.attach(textarea as HTMLTextAreaElement);
                console.log("✓ Vietnamese input attached to textarea");
              } else {
                console.log(
                  "❌ No textarea found after OverType initialization",
                );
              }
            }, 500);

            return () => {
              const textarea = editorRef.current?.querySelector("textarea");

              if (textarea) {
                vietnameseInput.detach(textarea as HTMLTextAreaElement);
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

  useEffect(() => {
    vietnameseInput.setMethod(inputMethod);
    vietnameseInput.setEnabled(isVietnameseEnabled);
  }, [inputMethod, isVietnameseEnabled]);

  // Handle theme changes for OverType editor
  useEffect(() => {
    if (window.OverType && editorInstance) {
      const OverTypeClass = (window.OverType as any).default || window.OverType;
      // Use static method to change theme globally
      OverTypeClass.setTheme(customTheme);
    }
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
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
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
                color={!isVietnameseEnabled ? "danger" : "default"}
                size="sm"
                variant={!isVietnameseEnabled ? "solid" : "bordered"}
                onClick={handleOffClick}
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
              >
                OFF
              </Button>
              {(["AUTO", "TELEX", "VNI", "VIQR"] as InputMethod[]).map(
                (method) => (
                  <Button
                    key={method}
                    color={inputMethod === method && isVietnameseEnabled ? "primary" : "default"}
                    size="sm"
                    variant={inputMethod === method && isVietnameseEnabled ? "solid" : "bordered"}
                    onClick={() => {
                      handleMethodChange(method);
                      if (!isVietnameseEnabled) {
                        setIsVietnameseEnabled(true);
                      }
                    }}
                    className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
                  >
                    {method}
                  </Button>
                ),
              )}
            </div>
            
            {/* Second row: Action buttons (hidden on small screens when in single row, shown on mobile) */}
            <div className="!flex !flex-row !items-center !justify-start sm:!justify-end !gap-2 sm:!flex-grow !flex-wrap">
              <Button
                color="warning"
                size="sm"
                variant="bordered"
                onClick={handleClear}
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
              >
                Clear
              </Button>
              <Button
                color="primary"
                disabled={!content}
                size="sm"
                variant="bordered"
                onClick={handleCopy}
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
              >
                Copy
              </Button>
              <Button
                color="secondary"
                size="sm"
                variant="bordered"
                onClick={handlePaste}
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
              >
                Paste
              </Button>
              <Button
                color="success"
                disabled={!content}
                size="sm"
                variant="bordered"
                onClick={handleDownload}
                className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
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
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Download File</ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-500 mb-3">
                  Enter a filename for your markdown document:
                </p>
                <Input
                  autoFocus
                  label="Filename"
                  placeholder="vinakey-document"
                  value={filename}
                  onValueChange={setFilename}
                  variant="bordered"
                  description="The file will be saved as .md format"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmDownload();
                    }
                  }}
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