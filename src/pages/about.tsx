import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-8 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center">
          <h1 className={title()}>About VinaKey 2</h1>
          <div className={subtitle({ class: "mt-4" })}>
            Công cụ gõ tiếng Việt hiện đại với hỗ trợ markdown editor
          </div>
        </div>

        <div className="max-w-4xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
            <p className="text-lg leading-relaxed">
              VinaKey 2 là phiên bản hiện đại của công cụ gõ tiếng Việt trực
              tuyến, kết hợp với markdown editor mạnh mẽ. Được xây dựng với công
              nghệ web hiện đại, VinaKey 2 cung cấp trải nghiệm gõ tiếng Việt
              mượt mà và các tính năng soạn thảo văn bản tiên tiến.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Tính năng chính</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">🇻🇳 Gõ tiếng Việt</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hỗ trợ AUTO, TELEX, VNI, VIQR</li>
                  <li>Chuyển đổi kiểu gõ nhanh chóng</li>
                  <li>Tối ưu hóa cho mobile</li>
                  <li>Không cần cài đặt phần mềm</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  📝 Markdown Editor
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>WYSIWYG editing với overtype</li>
                  <li>Toolbar tiện lợi</li>
                  <li>Preview thời gian thực</li>
                  <li>Hỗ trợ keyboard shortcuts</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Công nghệ</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Frontend</h3>
                <p>React, TypeScript, TailwindCSS, HeroUI</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Editor</h3>
                <p>OverType library - lightweight markdown editor</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Input Method</h3>
                <p>Modernized AVIM logic</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Kiểu gõ tiếng Việt</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 p-2">
                      Kiểu gõ
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 p-2">
                      Sắc
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 p-2">
                      Huyền
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 p-2">
                      Hỏi
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 p-2">
                      Ngã
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 p-2">
                      Nặng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
                      TELEX
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      s
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      f
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      r
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      x
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      j
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
                      VNI
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      1
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      2
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      3
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      4
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      5
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
                      VIQR
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      &apos;
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      `
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      ?
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      ~
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      .
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <Link
              isExternal
              className="text-primary hover:underline"
              href="https://github.com/vinakey/vinakey2"
            >
              📖 Xem source code trên GitHub
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
