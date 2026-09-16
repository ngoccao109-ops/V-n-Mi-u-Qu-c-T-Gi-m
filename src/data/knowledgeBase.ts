export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'khai_niem' | 'dia_diem' | 'dong_ho' | 'nghe_nhan' | 'quy_trinh' | 'hoa_van' | 'bao_quan' | 'nguon_goc';
  summary: string;
  content: string;
  sources: string[];
  cautions?: string[];
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sources: string[];
  emotion?: 'idle' | 'explaining' | 'happy' | 'thinking' | 'confused' | 'shakeHead' | 'sad';
}

export const VERIFIED_SOURCES = [
  { id: 'S1', title: 'Cổng thông tin điện tử phường Nghĩa Đô: "Phường Nghĩa Đô"', date: '30/06/2025' },
  { id: 'S2', title: 'Cổng thông tin điện tử phường Nghĩa Đô: "Nhà thờ tổ nghề làm giấy sắc - Họ Lại"', date: '03/07/2025' },
  { id: 'S3', title: 'Trung tâm Lưu trữ quốc gia I: "Về các loại dấu triện kim bảo trên sắc phong thần 1428-1945"', date: '28/06/2017' },
  { id: 'S4', title: 'Trung tâm Lưu trữ quốc gia I: "Về các loại dấu triện kim bảo trên sắc phong thần 1428-1945 (giấy Nghè, kích thước và ấn triện)"', date: '28/06/2017' },
  { id: 'S5', title: 'Cơ quan lưu trữ/Viện Bảo tồn di tích trên cổng Trung tâm Lưu trữ quốc gia I: "Đề xuất phương pháp bảo quản tài liệu giấy trong các di tích"', date: '2023-2024' },
  { id: 'S6', title: 'Bảo tàng Lịch sử Quốc gia: "Khám phá sắc phong của các triều đại phong kiến Việt Nam"', date: '28/03/2011' },
  { id: 'S7', title: 'Bảo tàng Lịch sử Quốc gia: "Sưu tập sắc phong thời Lê - Nguyễn ở Bảo tàng Lịch sử Quốc gia"', date: '2015' },
  { id: 'S8', title: 'VOV2 - Đài Tiếng nói Việt Nam: "Độc đáo nghề làm giấy sắc"', date: '15/10/2020' },
  { id: 'S9', title: 'Báo ảnh Việt Nam - Thông tấn xã Việt Nam: "Người nghệ nhân duy nhất của dòng họ Lại làm giấy sắc phong"', date: '18/03/2025' },
  { id: 'S10', title: 'Báo Nhân Dân: "Nghề làm giấy sắc ở Nghĩa Đô"', date: '14/06/2012' },
  { id: 'S11', title: 'Báo Quân đội nhân dân: "Truyền nhân đời thứ 26 của dòng họ làm giấy sắc phong"', date: '23/12/2025' },
  { id: 'S12', title: 'Báo Điện tử Chính phủ - chuyên trang Thủ đô Hà Nội: "Chi tiết 126 xã, phường mới vừa được HĐND TP Hà Nội thông qua"', date: '29/04/2025' },
  { id: 'S13', title: 'Hà Nội Online - Đài Phát thanh và Truyền hình Hà Nội: "Tìm về cội nguồn tấm giấy sắc phong"', date: '18/09/2024' }
];

export const VERIFIED_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'khai_niem_nen_tang',
    title: 'Khái niệm nền tảng: Giấy Dó, Giấy Sắc và Sắc Phong',
    category: 'khai_niem',
    summary: 'Phân biệt rạch ròi 3 thuật ngữ: Giấy dó (vật liệu nền), Giấy sắc (giấy đã xử lý công phu), Sắc phong (văn bản triều đình ban).',
    content: `• Giấy dó: Vật liệu giấy thủ công nền tảng. Giấy sắc được phát triển từ giấy dó sau khi trải qua các khâu xử lý đặc biệt (vào keo, nhuộm màu, nghè bóng, vẽ hoa văn). Không thể coi mọi giấy dó đều là giấy sắc.
• Giấy sắc (còn gọi là Giấy Nghè): Là loại giấy đặc biệt dùng để viết sắc. Có nguồn gốc từ giấy dó, có độ dai, dày và bền; gắn với làng Nghè - Nghĩa Đô xưa. Được chế tác bằng kỹ thuật thủ công chuyên biệt để phục vụ triều đình.
• Sắc phong: Là loại văn bản chính thống của nhà nước phong kiến do triều đình/nhà vua ban, có nội dung, niên đại, thể thức và ấn triện tương ứng. Sắc phong dùng để phong/tặng chức tước cho quan lại hoặc phong thần cho các vị thần linh, hiển thánh. Sắc phong là văn bản; giấy sắc là vật liệu.
• Bản phục dựng / Bản mô phỏng: Sản phẩm được làm lại để nghiên cứu, giáo dục; không được gọi bản tái tạo mới là cổ vật hay sắc phong nguyên gốc.`,
    sources: ['S4', 'S6', 'S7'],
    cautions: [
      'Tuyệt đối không đồng nhất giấy sắc với sắc phong.',
      'Không nói cứ có rồng mây màu vàng là thành sắc phong.'
    ]
  },
  {
    id: 'nghia_do_dia_ly',
    title: 'Nghĩa Đô - Không gian địa phương của nghề giấy sắc',
    category: 'dia_diem',
    summary: 'Vùng đất Từ Liêm xưa, làng Trung Nha (làng Nghè), các thôn Tiên Thượng, Vạn Long, An Phú.',
    content: `Khu vực Nghĩa Đô trong lịch sử gồm các thôn: Tiên Thượng (làng Tân), Trung Nha (làng Nghè), Vạn Long (làng Dâu) và An Phú.
Trong bối cảnh nghề giấy sắc, tên Trung Nha (làng Nghè) đặc biệt quan trọng vì nhiều nguồn lưu trữ và bảo tàng dùng từ "giấy Nghè" để chỉ loại giấy gắn liền với nơi sản xuất này.
Theo Cổng thông tin điện tử phường Nghĩa Đô, đơn vị hành chính sau sắp xếp năm 2025 có diện tích 4,34 km² và quy mô dân số 125.568 người. Cổng thông tin phường liệt kê nghề làm giấy sắc phong của họ Lại là một trong những nét nghề truyền thống đáng chú ý của địa bàn.`,
    sources: ['S1', 'S2', 'S4', 'S12']
  },
  {
    id: 'nha_tho_to_nghe',
    title: 'Nhà thờ tổ nghề làm giấy sắc - Họ Lại',
    category: 'dong_ho',
    summary: 'Di tích lịch sử cấp quốc gia xếp hạng năm 2006 tại ngõ 27 ngách 27/39 Võ Chí Công, phường Nghĩa Đô.',
    content: `• Tên chính thức nên dùng: Nhà thờ tổ nghề làm giấy sắc - Họ Lại.
• Địa chỉ theo cổng thông tin phường: Ngõ 27 - ngách 27/39 Võ Chí Công, phường Nghĩa Đô, Hà Nội.
• Năm xếp hạng: 2006.
• Quyết định xếp hạng: Quyết định số 79/2006/QĐ-BVHTT ngày 28/9/2006 của Bộ Văn hóa - Thông tin.
• Đối tượng thờ phụng: Tổ tiên nghề làm giấy sắc.
• Ý nghĩa trong dự án: Điểm neo địa lý - lịch sử để kết nối bản đồ văn hóa Nghĩa Đô với nghề giấy sắc và câu chuyện dòng họ Lại.`,
    sources: ['S2'],
    cautions: [
      'Không tự ý nâng hạng di tích thành "di sản văn hóa phi vật thể quốc gia" hay "di sản UNESCO" vì chưa có quyết định tương ứng.'
    ]
  },
  {
    id: 'dong_ho_lai_truyen_thong',
    title: 'Dòng họ Lại và truyền thống làm giấy sắc',
    category: 'dong_ho',
    summary: 'Nghề gắn với họ Lại ở Nghĩa Đô từ thời Lê - Trịnh; thông tin về Lại Giản Trực, Lại Thế Giáp và mốc thời gian.',
    content: `Theo gia phả và lời kể của hậu duệ dòng họ Lại được VOV2 và Báo Nhân Dân ghi nhận, nghề giấy sắc gắn với họ Lại ở Nghĩa Đô từ thời Lê - Trịnh.
• Nguồn VOV2 nêu người sáng tạo/khởi nghiệp giấy sắc trong gia phả là Lại Giản Trực, cháu nội Lại Thế Giáp.
• Báo Nhân Dân kể truyền thống gia đình gắn Lại Thế Giáp với gia đình chúa Trịnh Tráng và đặc ân làm giấy sắc cung cấp cho triều đình (thế kỷ XVII).
• Về con số "hơn 600 năm": Báo ảnh Việt Nam dẫn lời ông Lại Phú Thạch nói truyền thống làm giấy của họ Lại có lịch sử hơn 600 năm. Các nguồn khác lại gắn đặc quyền làm giấy sắc cho triều đình với thời Lê - Trịnh thế kỷ XVII. Chatbot phân biệt rõ hai lớp thông tin này (truyền thống làm giấy của dòng họ và thời điểm nhận đặc quyền làm giấy sắc triều đình), không biến thành niên đại tuyệt đối khi chưa có nguồn lưu trữ độc lập xác nhận.`,
    sources: ['S8', 'S9', 'S10']
  },
  {
    id: 'nghe_nhan_lai_phu_thach',
    title: 'Nghệ nhân Lại Phú Thạch - Người gìn giữ nghề',
    category: 'nghe_nhan',
    summary: 'Truyền nhân đời thứ 26 của dòng họ Lại, tiếp xúc nghề từ nhỏ và nỗ lực phục dựng nghề khi tuổi đã lớn.',
    content: `• Ông Lại Phú Thạch là truyền nhân đời thứ 26 của dòng họ Lại, hiện được các nguồn chính thống gần đây (Thông tấn xã Việt Nam, VOV, Báo Quân đội nhân dân) ghi nhận là người trực tiếp gìn giữ và thực hành nghề giấy sắc của dòng họ.
• Về việc học nghề: VOV2 ghi ông tiếp xúc với nghề từ khoảng 6 tuổi và được cha là nghệ nhân Lại Phú Bàn chỉ dạy. Bài viết Báo ảnh Việt Nam năm 2025 lại ghi ông ngồi cùng ông nội và nhớ lại những công thức. Cách diễn đạt an toàn nhất: Ông được tiếp xúc với nghề từ nhỏ trong môi trường gia đình, và sau này dựa vào ký ức nghề cùng quá trình thử nghiệm để phục dựng.
• Quá trình phục dựng: Sau giai đoạn nghề bị gián đoạn, ông bắt đầu phục dựng khi đã lớn tuổi (khoảng 60 tuổi). Quá trình phục dựng gặp nhiều khó khăn vì dụng cụ, nguyên liệu cũ đã thất lạc hoặc không còn đầy đủ, buộc ông phải tự lần tìm, chế tác và thử nghiệm lại nhiều khâu.
• Hiện trạng: Nhu cầu dùng giấy sắc ngày nay rất hạn chế; nghề đòi hỏi nhiều thời gian và công phu nhưng khó tạo sinh kế ổn định. Báo Quân đội nhân dân cuối năm 2025 cho biết sức khỏe của ông giảm sau bệnh nặng, việc ghi chép, số hóa tư liệu và giáo dục thế hệ trẻ là rất cấp thiết.`,
    sources: ['S8', 'S9', 'S11'],
    cautions: [
      'Không tự bịa ngày tháng năm sinh nếu tài liệu không công bố.',
      'Không giả danh nghệ nhân Lại Phú Thạch trong chatbot; robot là nhân viên số giới thiệu về di sản.'
    ]
  },
  {
    id: 'quy_trinh_8_buoc',
    title: 'Quy trình làm giấy sắc (Tóm tắt 8 bước sư phạm)',
    category: 'quy_trinh',
    summary: 'Quy trình công phu từ vỏ dó, seo giấy, ép phơi, phết keo, nhuộm vàng hoa hòe, nghè giấy đến vẽ họa tiết kim nhũ.',
    content: `Không có một quy chuẩn duy nhất bắt buộc đúng 8 bước, nhưng để dễ theo dõi và sư phạm hóa, quy trình có thể tóm tắt thành 8 bước cốt lõi:
1. Bước 1 - Chọn và xử lý dó: Vỏ cây dó được chọn, ngâm/xử lý với nước vôi, nấu hoặc đun cách thủy rồi giã cho xơ nhuyễn để chuẩn bị nguyên liệu bột giấy dó.
2. Bước 2 - Seo giấy: Bột dó được phân tán trong bể nước, người thợ dùng khuôn/liềm seo để gạn tạo thành từng tờ giấy. Giấy sắc khổ lớn xưa đòi hỏi nhiều người phối hợp.
3. Bước 3 - Ép, bóc và phơi: Tờ giấy sau seo được ép bớt nước, bóc ra và làm khô qua nhiều lượt phơi lặp lại.
4. Bước 4 - Vào/phết keo: Giấy được quét lớp keo/chất kết dính tự nhiên nhằm tăng độ bền, độ dai và khả năng chống tác động của môi trường, mối mọt. Công thức và tỷ lệ cụ thể thuộc bí quyết gia truyền.
5. Bước 5 - Nhuộm/phết màu: Tạo màu vàng đặc trưng, trong đó hoa hòe là nguyên liệu truyền thống được nhắc đến. Quét màu nhiều lượt và phơi giữa các lượt.
6. Bước 6 - Nghè giấy: Giấy khô đặt trên phiến đá phẳng, người thợ dùng chày gỗ dài nện đều theo nhịp, vừa nện vừa điều chỉnh vị trí giấy để lực phân bố đều. Khi giấy mỏng hơn, bề mặt đanh, mịn, bóng và tiếng chày đanh lại là đạt yêu cầu.
7. Bước 7 - Tạo bố cục, họa tiết viền/triện: Định hình các hệ thống khung viền, triện gấm, họa tiết theo phẩm cấp quy định.
8. Bước 8 - Vẽ và hoàn thiện hoa văn: Vẽ hoa văn rồng, mây, chữ Thọ, mô-típ tương ứng bằng kỹ thuật vẽ chạy (vẽ nét) và vẽ đồ (tô phủ vật liệu như vàng, bạc thật hoặc kim nhũ).`,
    sources: ['S6', 'S8', 'S9', 'S11']
  },
  {
    id: 'thao_tac_nghe_giay',
    title: 'Công đoạn đặc biệt: Nghè giấy là gì?',
    category: 'quy_trinh',
    summary: 'Nghè giấy là thao tác nện chày gỗ dài trên phiến đá phẳng để làm giấy đanh, mịn và bóng.',
    content: `Nghè giấy không phải là thao tác gõ nhẹ trên bàn!
Theo ghi nhận từ VOV2 và Báo Quân đội nhân dân, tờ giấy sau khi phết keo nhuộm màu được đặt trên một phiến đá phẳng. Người thợ thường đứng hoặc khom người, hai tay cầm chày gỗ dài nện đều nhịp nhàng xuống mặt giấy, vừa nện vừa khéo léo dịch chuyển để lực nện trải đều khắp tờ giấy.
Mục đích của việc nghè là nén chặt các thớ xơ dó, làm tờ giấy mỏng hơn, đanh chắc, bề mặt phẳng mịn và bóng láng. Dấu hiệu nhận biết giấy đạt độ chuẩn là khi tiếng gõ của chày trên mặt đá phát ra âm thanh đanh tai và giòn giã. Đây là thao tác lao động nặng, đòi hỏi cảm nhận tinh tế bằng tai, tay và mắt.`,
    sources: ['S8', 'S11']
  },
  {
    id: 'hoa_van_kich_thuoc_an_trien',
    title: 'Hình thức, hoa văn, kích thước và ấn triện trên sắc phong',
    category: 'hoa_van',
    summary: 'Hoa văn rồng mây theo phẩm cấp; kích thước phổ biến 119-140cm x 44-53cm; ấn triện Sắc mệnh chi bảo.',
    content: `• Phân loại: Bảo tàng Lịch sử Quốc gia phân biệt hai nhóm chính: Sắc phong/tặng cho bách quan và Sắc phong thần.
• Hoa văn: Khác nhau tùy theo loại và phẩm cấp, bao gồm rồng (rồng ổ, rồng leo, rồng giáng), mây, hồi văn, triện gấm, tứ linh (long, lân, quy, phụng), nhị linh, ngũ tinh, thất tinh, chữ Thọ, bầu rượu, túi thơ... Không được coi mọi sắc phong đều có chung một mẫu hoa văn.
• Kỹ thuật vẽ: Kỹ thuật trang trí truyền thống gồm "vẽ chạy" (tạo đường nét) và "vẽ đồ" (tô phủ vật liệu). Vàng, bạc thật hoặc kim nhũ từng được dùng trên mặt giấy.
• Kích thước: Theo Trung tâm Lưu trữ quốc gia I, nhiều đạo sắc phong có dạng hình chữ nhật, kích thước phổ biến dài khoảng 119–140 cm, rộng 44–53 cm; cá biệt có đạo sắc thời Cảnh Hưng dài tới 195 cm, rộng 60 cm.
• Ấn triện: Sắc phong mang kim bảo/ấn triện của triều đình. "Sắc mệnh chi bảo" xuất hiện từ thời Lê sơ và tiếp tục dùng qua nhiều thời kỳ; triều Nguyễn có giai đoạn dùng "Phong tặng chi bảo", sau đó dùng "Sắc mệnh chi bảo".`,
    sources: ['S4', 'S6']
  },
  {
    id: 'bao_quan_sac_phong',
    title: 'Bảo quản sắc phong và tài liệu giấy cổ',
    category: 'bao_quan',
    summary: 'Môi trường 18-22°C, độ ẩm 45-55%, tránh ánh sáng, tuyệt đối không dán băng dính hay ép plastic.',
    content: `Tài liệu giấy cổ và sắc phong rất dễ bị tổn hại bởi nhiệt độ, độ ẩm, nấm mốc, mối mọt, ánh sáng và hóa chất.
Các khuyến nghị bảo quản từ cơ quan lưu trữ:
• Nhiệt độ thích hợp trong kho/phòng bảo quản chuyên dụng: 18–22°C, độ ẩm tương đối: 45–55%.
• Lưu giữ trong các vật liệu đựng phi axit (hộp giấy trung tính), tránh ánh sáng trực tiếp, bụi bẩn và côn trùng.
• TUYỆT ĐỐI KHÔNG: Dán băng dính, ép plastic hoặc tự dùng hóa chất tại nhà khi sắc phong bị rách hỏng (ép plastic sẽ hủy hoại xơ giấy và không thể bóc tách để phục chế).
• Khi tài liệu bị hư hại, cần liên hệ các chuyên gia, cơ quan lưu trữ hoặc Viện Bảo tồn di tích có chuyên môn về tu bổ giấy cổ và am hiểu Hán Nôm để xử lý.`,
    sources: ['S5']
  }
];

export const VERIFIED_QA_LIST: QAItem[] = [
  {
    id: 'q1',
    question: 'Giấy sắc là gì?',
    answer: 'Giấy sắc là loại giấy đặc biệt, phát triển từ giấy dó và được xử lý công phu để dùng cho việc viết sắc của triều đình. Các nguồn lưu trữ và bảo tàng còn gọi là "giấy Nghè", gắn liền với làng Nghè - Nghĩa Đô xưa của Hà Nội.',
    category: 'Khái niệm',
    sources: ['S4', 'S7'],
    emotion: 'explaining'
  },
  {
    id: 'q2',
    question: 'Sắc phong là gì?',
    answer: 'Sắc phong là văn bản chính thống do nhà vua hoặc triều đình phong kiến ban, dùng trong các việc như phong tặng chức tước cho quan lại hoặc phong thần cho các vị thần linh, hiển thánh được thờ trong cộng đồng. Sắc phong là văn bản, còn giấy sắc là vật liệu làm nên văn bản đó.',
    category: 'Khái niệm',
    sources: ['S6'],
    emotion: 'explaining'
  },
  {
    id: 'q3',
    question: 'Vì sao gọi là giấy Nghè?',
    answer: 'Cơ quan lưu trữ và Bảo tàng Lịch sử Quốc gia giải thích cách gọi "giấy Nghè" gắn với làng Nghè - tên gọi Nôm của khu vực Trung Nha, thuộc vùng Nghĩa Đô xưa, nơi chuyên sản xuất loại giấy đặc biệt này cho triều đình.',
    category: 'Địa danh',
    sources: ['S4', 'S6'],
    emotion: 'explaining'
  },
  {
    id: 'q4',
    question: 'Bác Lại Phú Thạch là ai?',
    answer: 'Ông Lại Phú Thạch là truyền nhân đời thứ 26 của dòng họ Lại tại Nghĩa Đô. Ông là người trực tiếp gìn giữ, phục dựng nhiều công đoạn tinh hoa của nghề làm giấy sắc phong truyền thống theo ghi nhận từ các nguồn chính thống gần đây.',
    category: 'Nghệ nhân',
    sources: ['S9', 'S11'],
    emotion: 'explaining'
  },
  {
    id: 'q5',
    question: 'Bác Thạch học nghề từ bao giờ và ai dạy?',
    answer: 'Theo các nguồn chính thống, ông Thạch được tiếp xúc với nghề từ khoảng 6 tuổi trong môi trường gia đình. Chi tiết người truyền dạy có nguồn ghi là cha ông (nghệ nhân Lại Phú Bàn), nguồn khác ghi ông học từ ông nội, do đó có thể khẳng định an toàn là ông được người thân trong dòng họ truyền dạy từ nhỏ.',
    category: 'Nghệ nhân',
    sources: ['S8', 'S9'],
    emotion: 'explaining'
  },
  {
    id: 'q6',
    question: 'Nghè giấy để làm gì?',
    answer: 'Nghè giấy là công đoạn dùng chày gỗ dài nện đều đặn xuống tờ giấy đặt trên phiến đá phẳng. Mục đích là nén chặt thớ xơ dó, làm cho bề mặt giấy trở nên đanh chắc, nhẵn mịn và bóng láng, giúp nét chữ viết lên không bị nhòe.',
    category: 'Kỹ thuật',
    sources: ['S8', 'S11'],
    emotion: 'explaining'
  },
  {
    id: 'q7',
    question: 'Nghề làm giấy sắc ở Nghĩa Đô có gì đặc biệt?',
    answer: 'Nghề làm giấy sắc Nghĩa Đô là nghề thủ công chuyên biệt từng được triều đình phong kiến giao đặc quyền sản xuất giấy quý để viết sắc phong. Tờ giấy phải trải qua nhiều khâu cầu kỳ: vào keo chống mọt, nhuộm màu hoa hòe, nghè đá tạo độ bóng và vẽ hoa văn bằng vàng, bạc hoặc kim nhũ.',
    category: 'Di sản',
    sources: ['S8', 'S9', 'S10'],
    emotion: 'explaining'
  },
  {
    id: 'q8',
    question: 'Nhà thờ họ Lại ở đâu?',
    answer: 'Theo Cổng thông tin điện tử phường Nghĩa Đô, Nhà thờ tổ nghề làm giấy sắc - Họ Lại hiện tọa lạc tại ngõ 27, ngách 27/39 đường Võ Chí Công, phường Nghĩa Đô, thành phố Hà Nội.',
    category: 'Di tích',
    sources: ['S2'],
    emotion: 'explaining'
  },
  {
    id: 'q9',
    question: 'Nhà thờ họ Lại đã được xếp hạng di tích chưa?',
    answer: 'Có bạn nhé! Nhà thờ tổ nghề làm giấy sắc - Họ Lại đã được xếp hạng Di tích Lịch sử cấp Quốc gia năm 2006 theo Quyết định số 79/2006/QĐ-BVHTT ngày 28/9/2006 của Bộ Văn hóa - Thông tin.',
    category: 'Di tích',
    sources: ['S2'],
    emotion: 'happy'
  },
  {
    id: 'q10',
    question: 'Nhà thờ họ Lại có phải di sản UNESCO không?',
    answer: 'Hiện nay không có căn cứ nào trong các hồ sơ chính thức ghi nhận điều này bạn nhé. Di tích Nhà thờ tổ nghề làm giấy sắc - Họ Lại chính thức được xếp hạng di tích quốc gia vào năm 2006.',
    category: 'Di tích',
    sources: ['S2'],
    emotion: 'explaining'
  },
  {
    id: 'q11',
    question: 'Quy trình làm giấy sắc gồm những bước nào?',
    answer: 'Quy trình làm giấy sắc có thể tóm tắt sư phạm thành 8 bước cốt lõi: 1. Chọn và xử lý dó; 2. Seo giấy; 3. Ép, bóc và phơi; 4. Vào/phết keo; 5. Nhuộm màu vàng (hoa hòe); 6. Nghè giấy trên đá; 7. Tạo bố cục viền/triện; 8. Vẽ và hoàn thiện hoa văn rồng mây bằng kim nhũ.',
    category: 'Quy trình',
    sources: ['S6', 'S8', 'S9', 'S11'],
    emotion: 'explaining'
  },
  {
    id: 'q12',
    question: 'Vì sao giấy sắc có màu vàng?',
    answer: 'Màu vàng đặc trưng của giấy sắc có được qua công đoạn nhuộm/phết màu nhiều lượt. Trong đó, hoa hòe là một nguyên liệu tự nhiên truyền thống quan trọng được các nghệ nhân sử dụng để tạo nên sắc vàng ấm áp và bền màu qua hàng trăm năm.',
    category: 'Kỹ thuật',
    sources: ['S9', 'S11'],
    emotion: 'explaining'
  },
  {
    id: 'q13',
    question: 'Giấy sắc có chống mối mọt không?',
    answer: 'Có bạn nhé! Giấy được quét các lớp keo và hợp chất tự nhiên đặc biệt nhằm gia tăng độ bền dai và chống lại sự xâm hại của mối mọt hay nấm mốc. Công thức và tỷ lệ cụ thể thuộc tri thức gia truyền được gìn giữ qua nhiều thế hệ.',
    category: 'Kỹ thuật',
    sources: ['S8', 'S9'],
    emotion: 'explaining'
  },
  {
    id: 'q14',
    question: 'Hoa văn trên giấy sắc có giống nhau hết không?',
    answer: 'Không giống nhau bạn nhé! Tư liệu bảo tàng ghi nhận hoa văn trên giấy sắc rất phong phú và phân biệt theo từng cấp bậc: có sắc vẽ rồng mây, triện gấm, tứ linh (long, lân, quy, phụng), nhị linh, ngũ tinh, thất tinh, chữ Thọ hay túi thơ bầu rượu tùy theo đối tượng được ban sắc.',
    category: 'Hoa văn',
    sources: ['S6'],
    emotion: 'explaining'
  },
  {
    id: 'q15',
    question: 'Ngày xưa có dùng vàng bạc thật không?',
    answer: 'Các nguồn từ Bảo tàng Lịch sử Quốc gia và VOV2 ghi nhận kỹ thuật trang trí cổ xưa từng sử dụng bột vàng, bột bạc thật hoặc kim nhũ tán mịn kết hợp với keo để vẽ hoa văn rồng mây lấp lánh trên nền giấy sắc.',
    category: 'Kỹ thuật',
    sources: ['S6', 'S8'],
    emotion: 'happy'
  },
  {
    id: 'q16',
    question: 'Nghề giấy sắc có lịch sử hơn 600 năm không?',
    answer: 'Có nguồn dẫn lời ông Lại Phú Thạch chia sẻ truyền thống làm giấy của họ Lại có lịch sử hơn 600 năm; trong khi các nguồn khác gắn đặc quyền sản xuất giấy sắc cho triều đình vào thời Lê - Trịnh (thế kỷ XVII). Hai mốc này phản ánh truyền thống nghề giấy lâu đời của dòng họ và thời điểm nhận đặc quyền làm giấy sắc.',
    category: 'Lịch sử',
    sources: ['S8', 'S9', 'S10'],
    emotion: 'explaining'
  },
  {
    id: 'q17',
    question: 'Sắc phong nên được bảo quản thế nào?',
    answer: 'Cơ quan lưu trữ khuyến cáo bảo quản sắc phong trong phòng có nhiệt độ 18–22°C, độ ẩm 45–55%, đặt trong hộp phi axit, tránh ánh sáng trực tiếp. Tuyệt đối không tự ý ép plastic hay dán băng dính lên sắc phong vì sẽ làm hư hại vĩnh viễn cấu trúc xơ giấy.',
    category: 'Bảo quản',
    sources: ['S5'],
    emotion: 'explaining'
  }
];

export const FALLBACK_UNKNOWN_ANSWER = 'Xin lỗi, tôi sẽ sớm cập nhật thêm kiến thức!';
