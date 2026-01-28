import { Chapter } from './types';

export const textbookData: Chapter[] = [
  {
    id: "chap1",
    title: "Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
    description: "Nghiên cứu tính đơn điệu, cực trị, tiệm cận và khảo sát hàm số.",
    lessons: [
      {
        id: "chap1_lesson1",
        title: "§1. Tính đơn điệu của hàm số",
        content: {
          theory: `
**1. Định nghĩa**
Giả sử hàm số $y = f(x)$ xác định trên khoảng $K$.
- Hàm số $f(x)$ **đồng biến** (tăng) trên $K$ nếu với mọi $x_1, x_2 \\in K, x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.
- Hàm số $f(x)$ **nghịch biến** (giảm) trên $K$ nếu với mọi $x_1, x_2 \\in K, x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$.

**2. Điều kiện cần và đủ**
Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $K$.
- Nếu $f'(x) > 0$ với mọi $x \\in K$ thì hàm số **đồng biến** trên $K$.
- Nếu $f'(x) < 0$ với mọi $x \\in K$ thì hàm số **nghịch biến** trên $K$.
          `,
          example: "Xét tính đơn điệu của hàm số $y = x^3 - 3x + 1$.",
          solution: `
1. **Tập xác định:** $D = \\mathbb{R}$.
2. **Đạo hàm:** $y' = 3x^2 - 3$.
3. **Xét dấu:** $y' = 0 \\Leftrightarrow x = \\pm 1$.
4. **Kết luận:**
   - Hàm số đồng biến trên $(-\\infty; -1)$ và $(1; +\\infty)$.
   - Hàm số nghịch biến trên $(-1; 1)$.
          `
        },
        exercises: [
            {
                id: "ex1_1",
                question: "Cho hàm số $y = f(x)$ có đồ thị như hình vẽ (hàm bậc 3, cực đại tại $x=-1$, cực tiểu tại $x=1$). Hàm số đã cho nghịch biến trên khoảng nào dưới đây?",
                options: [
                  "$(0; 1)$",
                  "$(-1; 1)$",
                  "$(-\\infty; -1)$",
                  "$(1; +\\infty)$"
                ],
                correctOptionIndex: 1,
                explanation: "Quan sát đồ thị, đồ thị đi xuống từ trái sang phải trên khoảng $(-1; 1)$. Vậy hàm số nghịch biến trên $(-1; 1)$."
            }
        ]
      },
      {
        id: "chap1_lesson2",
        title: "§2. Giá trị lớn nhất và giá trị nhỏ nhất",
        content: {
          theory: `
**Quy tắc tìm GTLN, GTNN trên đoạn [a; b]**
1. Tìm các điểm $x_i \\in (a; b)$ mà tại đó $f'(x) = 0$ hoặc không xác định.
2. Tính $f(a), f(b), f(x_i)$.
3. Số lớn nhất là $\\max$, số nhỏ nhất là $\\min$.
          `,
          example: "Tìm GTLN của hàm số $f(x) = x^4 - 2x^2 + 3$ trên đoạn $[0; 2]$.",
          solution: `
- $f'(x) = 4x^3 - 4x$. Cho $f'(x)=0 \\Rightarrow x=0, x=1, x=-1$.
- Trên $[0; 2]$ ta xét $x=0, x=1$.
- Tính giá trị: $f(0)=3, f(1)=2, f(2)=11$.
- Vậy $\\max f(x) = 11$.
          `
        },
        exercises: [
           {
                id: "ex1_2",
                question: "Cho hàm số $y = f(x)$ có đồ thị như Hình 2 (trong tài liệu). Hàm số đã cho có điểm cực đại là:",
                options: ["$x=1$", "$x=-1$", "$x=2$", "$x=-2$"],
                correctOptionIndex: 1,
                explanation: "Quan sát Hình 2, ta thấy tại $x=-1$ đồ thị đạt đỉnh cao nhất trong lân cận (đổi chiều từ tăng sang giảm). Vậy điểm cực đại là $x=-1$."
            },
            {
                id: "ex1_3",
                question: "Giá trị nhỏ nhất của hàm số $y=f(x)$ trên đoạn $[-1; 1]$ theo Hình 3 là:",
                options: ["$-1$", "$1$", "$-4$", "$-2$"],
                correctOptionIndex: 2,
                explanation: "Quan sát Hình 3, điểm thấp nhất của đồ thị trên đoạn $[-1; 1]$ có tung độ là $-4$."
            }
        ]
      },
      {
        id: "chap1_lesson3",
        title: "§3. Đường tiệm cận của đồ thị hàm số",
        content: {
            theory: `
**1. Tiệm cận ngang:**
Đường thẳng $y = y_0$ là tiệm cận ngang nếu $\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$.

**2. Tiệm cận đứng:**
Đường thẳng $x = x_0$ là tiệm cận đứng nếu $\\lim_{x \\to x_0^+} f(x) = \\pm \\infty$ hoặc $\\lim_{x \\to x_0^-} f(x) = \\pm \\infty$.

**3. Tiệm cận xiên:**
Đường thẳng $y = ax + b$ là tiệm cận xiên nếu $\\lim_{x \\to +\\infty} [f(x) - (ax+b)] = 0$.
            `,
            example: "Tìm tiệm cận ngang của hàm số $y = \\frac{2x-1}{x+1}$.",
            solution: "Ta có $\\lim_{x \\to \\pm \\infty} \\frac{2x-1}{x+1} = 2$. Vậy tiệm cận ngang là $y=2$."
        },
        exercises: [
            {
                id: "ex1_4",
                question: "Cho hàm số $y=f(x)$ có đồ thị như Hình 4. Đồ thị hàm số đã cho có đường tiệm cận ngang là:",
                options: ["$x=-1$", "$y=-1$", "$x=2$", "$y=2$"],
                correctOptionIndex: 3,
                explanation: "Quan sát Hình 4, khi $x \\to \\pm \\infty$, đồ thị tiến sát về đường thẳng nằm ngang $y=2$."
            }
        ]
      },
      {
          id: "chap1_lesson4",
          title: "§4. Khảo sát sự biến thiên và vẽ đồ thị",
          content: {
              theory: "Sơ đồ khảo sát: 1. TXĐ; 2. Sự biến thiên (Chiều biến thiên, cực trị, tiệm cận, bảng biến thiên); 3. Đồ thị.",
              example: "Khảo sát hàm số $y = x^3 - 3x$.",
              solution: "HS tự thực hành vẽ bảng biến thiên và đồ thị."
          },
          exercises: []
      }
    ]
  },
  {
    id: "chap2",
    title: "Chương II: Toạ độ của vectơ trong không gian",
    description: "Hệ toạ độ Oxyz và các phép toán vectơ.",
    lessons: [
      {
        id: "chap2_lesson1",
        title: "§1. Vectơ và các phép toán vectơ",
        content: {
          theory: `
**Quy tắc hình hộp:**
Cho hình hộp $ABCD.A'B'C'D'$. Ta có: $\\vec{AB} + \\vec{AD} + \\vec{AA'} = \\vec{AC'}$.
          `,
          example: "Tính tổng ba vectơ xuất phát từ một đỉnh của hình lập phương.",
          solution: "Áp dụng quy tắc hình hộp, tổng bằng vectơ đường chéo xuất phát từ đỉnh đó."
        },
        exercises: [
            {
                id: "ex2_5",
                question: "Cho hình hộp $ABCD.A'B'C'D'$. Phát biểu nào sau đây đúng?",
                options: [
                    "$\\vec{AB} + \\vec{AD} + \\vec{AA'} = \\vec{CA'}$",
                    "$\\vec{AB} + \\vec{AD} + \\vec{AA'} = \\vec{C'A}$",
                    "$\\vec{AB} + \\vec{AD} + \\vec{AA'} = \\vec{A'C}$",
                    "$\\vec{AB} + \\vec{AD} + \\vec{AA'} = \\vec{AC'}$"
                ],
                correctOptionIndex: 3,
                explanation: "Theo quy tắc hình hộp: $\\vec{AB} + \\vec{AD} + \\vec{AA'} = \\vec{AC'}$."
            }
        ]
      },
      {
        id: "chap2_lesson2",
        title: "§2. Toạ độ của vectơ",
        content: {
          theory: `
Trong không gian $Oxyz$:
- $\\vec{u} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\Leftrightarrow \\vec{u} = (x; y; z)$.
- Tích vô hướng: $\\vec{a} \\cdot \\vec{b} = x_1x_2 + y_1y_2 + z_1z_2$.
- Độ dài: $|\\vec{a}| = \\sqrt{x_1^2 + y_1^2 + z_1^2}$.
          `,
          example: "Cho $\\vec{u} = 2\\vec{i} - \\vec{j} + 3\\vec{k}$. Tìm toạ độ $\\vec{u}$.",
          solution: "Toạ độ của $\\vec{u}$ là $(2; -1; 3)$."
        },
        exercises: [
            {
                id: "ex2_6",
                question: "Trong không gian $Oxyz$, toạ độ của vectơ $\\vec{u} = 4\\vec{i} - 5\\vec{j} + 6\\vec{k}$ là:",
                options: ["$(4; 5; 6)$", "$(4; -5; 6)$", "$(4; 5; -6)$", "$(-4; 5; 6)$"],
                correctOptionIndex: 1,
                explanation: "Các hệ số lần lượt của $\\vec{i}, \\vec{j}, \\vec{k}$ là $4, -5, 6$."
            },
            {
                id: "ex2_7",
                question: "Tích vô hướng của $\\vec{a}=(x_1; y_1; z_1)$ và $\\vec{b}=(x_2; y_2; z_2)$ bằng:",
                options: [
                    "$x_1x_2 + y_1y_2 + z_1z_2$",
                    "$(x_1+x_2; y_1+y_2; z_1+z_2)$",
                    "$\\sqrt{(x_2-x_1)^2 + ...}$",
                    "$(x_1+y_1+z_1)(x_2+y_2+z_2)$"
                ],
                correctOptionIndex: 0,
                explanation: "Công thức tích vô hướng: hoành nhân hoành + tung nhân tung + cao nhân cao."
            }
        ]
      }
    ]
  },
  {
    id: "chap3",
    title: "Chương III: Các số đặc trưng đo mức độ phân tán (Thống kê)",
    description: "Khoảng biến thiên, tứ phân vị, phương sai, độ lệch chuẩn mẫu số liệu ghép nhóm.",
    lessons: [
       {
           id: "chap3_lesson1",
           title: "§1. Số đặc trưng đo mức độ phân tán",
           content: {
               theory: `
**1. Khoảng biến thiên:** $R = x_{max} - x_{min}$.
**2. Phương sai ($s^2$) và Độ lệch chuẩn ($s$):**
Đo mức độ phân tán của số liệu quanh giá trị trung bình.
               `,
               example: "Tính khoảng biến thiên của mẫu số liệu ghép nhóm [50; 55), ..., [70; 75).",
               solution: "Khoảng biến thiên xấp xỉ $75 - 50 = 25$."
           },
           exercises: [
               {
                   id: "ex3_10",
                   question: "Công thức tính độ lệch chuẩn $s$ của mẫu số liệu ghép nhóm là:",
                   options: [
                       "$s = s^2$",
                       "$s = \\frac{1}{n}...$",
                       "$s = \\sum ...$",
                       "$s = \\sqrt{s^2}$"
                   ],
                   correctOptionIndex: 3,
                   explanation: "Độ lệch chuẩn là căn bậc hai của phương sai."
               },
               {
                   id: "ex3_12",
                   question: "Cho bảng số liệu cân nặng học sinh (Bảng 2 trong PDF). Khoảng biến thiên là:",
                   options: ["25", "50", "20", "75"],
                   correctOptionIndex: 0,
                   explanation: "Khoảng biến thiên = Đầu mút phải lớn nhất - Đầu mút trái nhỏ nhất = $75 - 50 = 25$."
               }
           ]
       }
    ]
  },
  {
    id: "chap4",
    title: "Chương IV: Nguyên hàm. Tích phân",
    description: "Khái niệm nguyên hàm, tích phân và ứng dụng.",
    lessons: [
      {
        id: "chap4_lesson1",
        title: "§1. Nguyên hàm",
        content: {
          theory: `
**1. Khái niệm:** $F(x)$ là nguyên hàm của $f(x)$ nếu $F'(x) = f(x)$.
**2. Tính chất:**
- $\\int kf(x)dx = k\\int f(x)dx$.
- $\\int [f(x) \\pm g(x)]dx = \\int f(x)dx \\pm \\int g(x)dx$.
          `,
          example: "Tìm $\\int (3x^2 + 1) dx$.",
          solution: "$\\int (3x^2 + 1) dx = x^3 + x + C$."
        },
        exercises: [
          {
            id: "ex4_1",
            question: "Hàm số $F(x) = x^3$ là một nguyên hàm của hàm số nào?",
            options: ["$f(x)=3x^2$", "$f(x)=\\frac{x^4}{4}$", "$f(x)=x^2$", "$f(x)=3x$"],
            correctOptionIndex: 0,
            explanation: "Vì $(x^3)' = 3x^2$."
          }
        ]
      },
      {
          id: "chap4_lesson2",
          title: "§2. Tích phân",
          content: {
              theory: "$\\int_a^b f(x)dx = F(b) - F(a)$ với $F(x)$ là nguyên hàm của $f(x)$.",
              example: "Tính $\\int_0^1 x dx$.",
              solution: "$\\int_0^1 x dx = \\frac{x^2}{2} \\Big|_0^1 = \\frac{1}{2} - 0 = \\frac{1}{2}$."
          },
          exercises: []
      }
    ]
  },
  {
      id: "chap5",
      title: "Chương V: Phương trình mặt phẳng, đường thẳng, mặt cầu",
      description: "Hình học Oxyz: Mặt phẳng, đường thẳng, mặt cầu.",
      lessons: [
          {
              id: "chap5_lesson1",
              title: "§1. Phương trình mặt phẳng",
              content: { theory: "Phương trình $Ax + By + Cz + D = 0$.", example: "", solution: "" },
              exercises: []
          }
      ]
  },
  {
      id: "chap6",
      title: "Chương VI: Một số yếu tố xác suất",
      description: "Xác suất có điều kiện, công thức Bayes.",
      lessons: [
          {
              id: "chap6_lesson1",
              title: "§1. Xác suất có điều kiện",
              content: { theory: "$P(A|B) = \\frac{P(AB)}{P(B)}$.", example: "", solution: "" },
              exercises: []
          }
      ]
  }
];