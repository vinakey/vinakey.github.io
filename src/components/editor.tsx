import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
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

  useEffect(() => {
    const initializeEditor = () => {
      if (editorRef.current && window.OverType) {
        try {
          // Initialize OverType editor using the default export
          const OverTypeClass =
            (window.OverType as any).default || window.OverType;
          const instances = new OverTypeClass(editorRef.current, {
            value: initialContent,
            placeholder: "Bắt đầu viết markdown với tiếng Việt...",
            toolbar: true,
            theme: theme === "dark" ? "cave" : "solar",
            fontSize: "16px",
            padding: "20px",
            autoResize: true,
            minHeight: "400px",
            onChange: (value: string) => {
              setContent(value);
              onContentChange?.(value);
            },
          });

          if (instances && instances.length > 0) {
            const instance = instances[0];

            setEditorInstance(instance);

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
            }, 500); // Increased timeout

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
    if (window.OverType) {
      const overtypeTheme = theme === "dark" ? "cave" : "solar";
      const OverTypeClass = (window.OverType as any).default || window.OverType;
      // Use static method to change theme globally
      OverTypeClass.setTheme(overtypeTheme);
    }
  }, [theme]);

  const handleMethodChange = (method: InputMethod) => {
    setInputMethod(method);
  };

  const handleToggleVietnamese = () => {
    setIsVietnameseEnabled(!isVietnameseEnabled);
  };

  const handleClear = () => {
    if (editorInstance) {
      editorInstance.setValue("");
      setContent("");
    }
  };

  const handleSampleText = () => {
    const sampleText = `# Chào mừng đến với VinaKey 2

## Tính năng chính

- **Gõ tiếng Việt**: Hỗ trợ các kiểu gõ phổ biến (AUTO, TELEX, VNI, VIQR)
- **Markdown Editor**: Soạn thảo markdown với giao diện WYSIWYG
- **Toolbar**: Các công cụ định dạng tiện lợi
- **Responsive**: Tương thích với mobile và desktop

## Hướng dẫn sử dụng

1. Chọn kiểu gõ tiếng Việt từ các nút bên trên
2. Bắt đầu viết nội dung markdown
3. Sử dụng toolbar để định dạng nhanh
4. Bấm nút "Copy" để sao chép nội dung

### Ví dụ văn bản

> "Có công mài sắt có ngày nên kim"

**Danh sách công việc:**
- [x] Tích hợp Vietnamese input
- [x] Tích hợp Overtype editor  
- [ ] Thêm tính năng export
- [ ] Thêm themes

\`\`\`javascript
// Code example
const vietnameseText = "Xin chào thế giới!";
console.log(vietnameseText);
\`\`\`

---

*Tạo bởi [VinaKey](https://github.com/vinakey/vinakey2) - công cụ gõ tiếng Việt hiện đại.*`;

    if (editorInstance) {
      editorInstance.setValue(sampleText);
      setContent(sampleText);
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
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              VinaKey 2 Editor
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Vietnamese typing with markdown support
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              color="success"
              size="sm"
              variant="flat"
              onClick={handleSampleText}
            >
              Load Sample
            </Button>

            <Button
              color="primary"
              disabled={!content}
              size="sm"
              variant="flat"
              onClick={handleCopy}
            >
              Copy Text
            </Button>

            <Button
              color="warning"
              size="sm"
              variant="flat"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vietnamese Input:
            </span>
            <Button
              color={isVietnameseEnabled ? "success" : "default"}
              size="sm"
              variant={isVietnameseEnabled ? "solid" : "flat"}
              onClick={handleToggleVietnamese}
            >
              {isVietnameseEnabled ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="flex gap-1">
            {(["AUTO", "TELEX", "VNI", "VIQR"] as InputMethod[]).map(
              (method) => (
                <Button
                  key={method}
                  color={inputMethod === method ? "primary" : "default"}
                  disabled={!isVietnameseEnabled}
                  size="sm"
                  variant={inputMethod === method ? "solid" : "flat"}
                  onClick={() => handleMethodChange(method)}
                >
                  {method}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div
          ref={editorRef}
          className="min-h-[400px] w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg focus-within:border-blue-500 transition-colors"
          data-testid="editor-container"
          style={{ height: "auto" }}
        />

        {content && (
          <div className="mt-4 text-sm text-gray-500 flex justify-between">
            <span>
              Characters: {content.length} | Words:{" "}
              {content.split(/\s+/).filter(Boolean).length}
            </span>
            <span>
              Method: {inputMethod} {isVietnameseEnabled ? "✓" : "✗"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
