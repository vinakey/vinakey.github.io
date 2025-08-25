import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
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
  const { theme } = useTheme();
  
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
            minHeight: "500px",
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Consolidated card with controls and editor */}
      <div className="mb-8">
        <Card>
          {/* Control bar at the top */}
          <CardBody className="!flex !flex-row !flex-nowrap !items-center !justify-start !gap-2 !overflow-x-auto !p-3 !border-b !border-divider">
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
            
            {/* Spacer to push action buttons to the right */}
            <div className="!flex-grow"></div>
            
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
              color="warning"
              size="sm"
              variant="bordered"
              onClick={handleClear}
              className="!px-2 !py-1 !min-w-0 !text-xs !font-medium !whitespace-nowrap !flex-shrink-0"
            >
              Clear
            </Button>
          </CardBody>
          
          {/* Editor container */}
          <div
            ref={editorRef}
            className="min-h-[500px] w-full"
            data-testid="editor-container"
            style={{ height: "auto" }}
          />
        </Card>
      </div>
    </div>
  );
}