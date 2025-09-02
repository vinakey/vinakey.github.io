import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import DefaultLayout from "@/layouts/default";
import Editor from "@/components/editor";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 py-8">
        {/* Main editor component */}
        <div className="w-full">
          <Editor initialContent="" />
        </div>

        {/* Input method reference tables */}
        <div className="w-full max-w-4xl mt-12 space-y-6">
          {/* Tone marks reference table */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-primary">
                Bảng dấu thanh
              </h3>
            </CardHeader>
            <CardBody>
              <Table
                aria-label="Bảng dấu thanh tiếng Việt"
                className="min-w-full"
              >
                <TableHeader>
                  <TableColumn>KIỂU GÕ</TableColumn>
                  <TableColumn>Sắc</TableColumn>
                  <TableColumn>Huyền</TableColumn>
                  <TableColumn>Hỏi</TableColumn>
                  <TableColumn>Ngã</TableColumn>
                  <TableColumn>Nặng</TableColumn>
                  <TableColumn>Mũ</TableColumn>
                  <TableColumn>Móc</TableColumn>
                  <TableColumn>Trăng</TableColumn>
                  <TableColumn>Đ</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-primary">
                      TELEX
                    </TableCell>
                    <TableCell className="font-mono text-lg">s</TableCell>
                    <TableCell className="font-mono text-lg">f</TableCell>
                    <TableCell className="font-mono text-lg">r</TableCell>
                    <TableCell className="font-mono text-lg">x</TableCell>
                    <TableCell className="font-mono text-lg">j</TableCell>
                    <TableCell className="font-mono text-lg">aa</TableCell>
                    <TableCell className="font-mono text-lg">ow</TableCell>
                    <TableCell className="font-mono text-lg">aw</TableCell>
                    <TableCell className="font-mono text-lg">dd</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-primary">
                      VNI
                    </TableCell>
                    <TableCell className="font-mono text-lg">1</TableCell>
                    <TableCell className="font-mono text-lg">2</TableCell>
                    <TableCell className="font-mono text-lg">3</TableCell>
                    <TableCell className="font-mono text-lg">4</TableCell>
                    <TableCell className="font-mono text-lg">5</TableCell>
                    <TableCell className="font-mono text-lg">6</TableCell>
                    <TableCell className="font-mono text-lg">7</TableCell>
                    <TableCell className="font-mono text-lg">8</TableCell>
                    <TableCell className="font-mono text-lg">9</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-primary">
                      VIQR
                    </TableCell>
                    <TableCell className="font-mono text-lg">&apos;</TableCell>
                    <TableCell className="font-mono text-lg">`</TableCell>
                    <TableCell className="font-mono text-lg">?</TableCell>
                    <TableCell className="font-mono text-lg">~</TableCell>
                    <TableCell className="font-mono text-lg">.</TableCell>
                    <TableCell className="font-mono text-lg">^</TableCell>
                    <TableCell className="font-mono text-lg">+</TableCell>
                    <TableCell className="font-mono text-lg">(</TableCell>
                    <TableCell className="font-mono text-lg">dd</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* Sentence example table */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-primary">
                Câu ví dụ:{" "}
                <span className="text-foreground">
                  Học gõ tiếng Việt thật dễ dàng
                </span>
              </h3>
            </CardHeader>
            <CardBody>
              <Table
                aria-label="Ví dụ gõ câu tiếng Việt"
                className="min-w-full"
              >
                <TableHeader>
                  <TableColumn className="w-24">KIỂU GÕ</TableColumn>
                  <TableColumn>CÁCH GÕ</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-primary">
                      TELEX
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      Hocj gox tieesng Vieetj thaatj deer daafng
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-primary">
                      VIQR
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      Ho.c go~ tie^&apos;ng Vie^.t tha^.t de^~ da~ng
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-primary">
                      VNI
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      Ho5c go6 tie61ng Vie65t tha65t de65 da4ng
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
