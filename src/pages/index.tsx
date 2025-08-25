import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Editor from "@/components/editor";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-8 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center">
          <span className={title()}>VinaKey&nbsp;</span>
          <span className={title({ color: "violet" })}>2&nbsp;</span>
          <br />
          <span className={title()}>
            Modern Vietnamese Input & Markdown Editor
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Gõ tiếng Việt và soạn thảo markdown dễ dàng, nhanh chóng - hoàn toàn
            miễn phí
          </div>
        </div>

        <div className="w-full max-w-6xl">
          <Editor
            initialContent=""
            onContentChange={(content) => {
              // Save to localStorage or handle content changes
              localStorage.setItem("vinakey2-content", content);
            }}
          />
        </div>

        <div className="text-center text-sm text-default-500 max-w-2xl">
          <p>
            <strong>Tính năng chính:</strong> Hỗ trợ các kiểu gõ phổ biến (AUTO,
            TELEX, VNI, VIQR), editor markdown với WYSIWYG, toolbar tiện lợi, và
            tương thích hoàn toàn với mobile.
          </p>
          <p className="mt-2">
            <strong>Hướng dẫn:</strong> Chọn kiểu gõ từ thanh công cụ, bắt đầu
            viết nội dung, sử dụng toolbar để định dạng, và sao chép kết quả khi
            hoàn thành.
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
