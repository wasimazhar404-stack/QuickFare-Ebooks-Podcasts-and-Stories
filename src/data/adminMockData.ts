export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: "Free" | "Premium" | "Lifetime";
  joinedDate: string;
  status: "Active" | "Suspended" | "Banned";
  booksRead: number;
  totalPages: number;
  readingTime: string;
  streak: number;
  country: string;
}

export interface AdminReview {
  id: string;
  bookId: number;
  bookTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Flagged";
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  user?: string;
  timestamp: string;
  type: "upload" | "purchase" | "review" | "update" | "user" | "system";
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface CategoryStat {
  name: string;
  count: number;
  revenue: number;
}

export const mockUsers: AdminUser[] = [
  { id: "u1", name: "Ahmed Khan", email: "ahmed.khan@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed", plan: "Premium", joinedDate: "2024-01-15", status: "Active", booksRead: 23, totalPages: 3400, readingTime: "48h 12m", streak: 15, country: "Pakistan" },
  { id: "u2", name: "Fatima Ali", email: "fatima.ali@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima", plan: "Lifetime", joinedDate: "2023-11-02", status: "Active", booksRead: 56, totalPages: 8200, readingTime: "120h 45m", streak: 89, country: "UAE" },
  { id: "u3", name: "Omar Hassan", email: "omar.hassan@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar", plan: "Free", joinedDate: "2024-03-20", status: "Active", booksRead: 5, totalPages: 600, readingTime: "8h 30m", streak: 3, country: "USA" },
  { id: "u4", name: "Ayesha Malik", email: "ayesha.m@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayesha", plan: "Premium", joinedDate: "2024-02-10", status: "Active", booksRead: 31, totalPages: 4500, readingTime: "62h 18m", streak: 42, country: "UK" },
  { id: "u5", name: "Zain Abbas", email: "zain.abbas@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zain", plan: "Free", joinedDate: "2024-05-01", status: "Suspended", booksRead: 2, totalPages: 200, readingTime: "3h 45m", streak: 1, country: "Canada" },
  { id: "u6", name: "Mariam Siddiqui", email: "mariam.s@protonmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariam", plan: "Premium", joinedDate: "2024-01-28", status: "Active", booksRead: 18, totalPages: 2700, readingTime: "38h 22m", streak: 21, country: "Saudi Arabia" },
  { id: "u7", name: "Ibrahim Qureshi", email: "ibrahim.q@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim", plan: "Lifetime", joinedDate: "2023-09-15", status: "Active", booksRead: 72, totalPages: 9500, readingTime: "156h 30m", streak: 120, country: "Pakistan" },
  { id: "u8", name: "Sana Rafiq", email: "sana.rafiq@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sana", plan: "Premium", joinedDate: "2024-04-05", status: "Active", booksRead: 12, totalPages: 1800, readingTime: "22h 15m", streak: 8, country: "Turkey" },
  { id: "u9", name: "Hamza Farooq", email: "hamza.f@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hamza", plan: "Free", joinedDate: "2024-06-10", status: "Active", booksRead: 1, totalPages: 120, readingTime: "2h 10m", streak: 1, country: "Bangladesh" },
  { id: "u10", name: "Nadia Javed", email: "nadia.javed@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nadia", plan: "Premium", joinedDate: "2024-02-22", status: "Active", booksRead: 27, totalPages: 3800, readingTime: "55h 40m", streak: 33, country: "USA" },
  { id: "u11", name: "Tariq Mahmood", email: "tariq.m@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tariq", plan: "Lifetime", joinedDate: "2023-10-08", status: "Active", booksRead: 64, totalPages: 8900, readingTime: "140h 12m", streak: 95, country: "Pakistan" },
  { id: "u12", name: "Rabia Akhtar", email: "rabia.a@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rabia", plan: "Premium", joinedDate: "2024-03-15", status: "Banned", booksRead: 0, totalPages: 0, readingTime: "0h", streak: 0, country: "India" },
  { id: "u13", name: "Kamran Shah", email: "kamran.s@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kamran", plan: "Free", joinedDate: "2024-05-20", status: "Active", booksRead: 8, totalPages: 1100, readingTime: "14h 50m", streak: 5, country: "Canada" },
  { id: "u14", name: "Hina Tariq", email: "hina.t@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hina", plan: "Premium", joinedDate: "2024-01-05", status: "Active", booksRead: 34, totalPages: 5000, readingTime: "68h 25m", streak: 50, country: "UAE" },
  { id: "u15", name: "Bilal Ahmed", email: "bilal.a@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bilal", plan: "Lifetime", joinedDate: "2023-12-20", status: "Active", booksRead: 48, totalPages: 7200, readingTime: "98h 15m", streak: 75, country: "UK" },
  { id: "u16", name: "Samina Kausar", email: "samina.k@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=samina", plan: "Premium", joinedDate: "2024-04-18", status: "Active", booksRead: 15, totalPages: 2200, readingTime: "28h 30m", streak: 12, country: "USA" },
  { id: "u17", name: "Usman Ghani", email: "usman.g@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman", plan: "Free", joinedDate: "2024-06-25", status: "Active", booksRead: 3, totalPages: 400, readingTime: "5h 20m", streak: 2, country: "Saudi Arabia" },
  { id: "u18", name: "Laila Noor", email: "laila.n@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laila", plan: "Premium", joinedDate: "2024-02-01", status: "Active", booksRead: 29, totalPages: 4200, readingTime: "58h 50m", streak: 37, country: "Pakistan" },
  { id: "u19", name: "Rashid Iqbal", email: "rashid.i@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rashid", plan: "Lifetime", joinedDate: "2023-08-12", status: "Active", booksRead: 81, totalPages: 10500, readingTime: "180h 45m", streak: 150, country: "Turkey" },
  { id: "u20", name: "Yasmin Bano", email: "yasmin.b@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yasmin", plan: "Premium", joinedDate: "2024-03-01", status: "Active", booksRead: 21, totalPages: 3100, readingTime: "42h 10m", streak: 19, country: "Bangladesh" },
  { id: "u21", name: "Arif Rehman", email: "arif.r@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arif", plan: "Free", joinedDate: "2024-05-12", status: "Suspended", booksRead: 4, totalPages: 500, readingTime: "6h 40m", streak: 2, country: "India" },
  { id: "u22", name: "Salma Hayat", email: "salma.h@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=salma", plan: "Premium", joinedDate: "2024-01-20", status: "Active", booksRead: 36, totalPages: 5400, readingTime: "72h 30m", streak: 55, country: "UAE" },
  { id: "u23", name: "Danish Ali", email: "danish.a@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=danish", plan: "Free", joinedDate: "2024-06-01", status: "Active", booksRead: 6, totalPages: 800, readingTime: "10h 15m", streak: 4, country: "Canada" },
  { id: "u24", name: "Shazia Perveen", email: "shazia.p@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shazia", plan: "Lifetime", joinedDate: "2023-11-25", status: "Active", booksRead: 59, totalPages: 8600, readingTime: "130h 20m", streak: 100, country: "UK" },
  { id: "u25", name: "Mohsin Raza", email: "mohsin.r@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohsin", plan: "Premium", joinedDate: "2024-04-10", status: "Active", booksRead: 14, totalPages: 2100, readingTime: "26h 45m", streak: 10, country: "Pakistan" },
  { id: "u26", name: "Amna Khalid", email: "amna.k@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amna", plan: "Free", joinedDate: "2024-06-15", status: "Active", booksRead: 2, totalPages: 300, readingTime: "4h 10m", streak: 1, country: "USA" },
  { id: "u27", name: "Farhan Qadir", email: "farhan.q@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=farhan", plan: "Premium", joinedDate: "2024-02-15", status: "Active", booksRead: 25, totalPages: 3700, readingTime: "48h 55m", streak: 28, country: "Saudi Arabia" },
  { id: "u28", name: "Noreen Anwar", email: "noreen.a@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noreen", plan: "Lifetime", joinedDate: "2023-10-30", status: "Active", booksRead: 67, totalPages: 9300, readingTime: "148h 10m", streak: 110, country: "UAE" },
  { id: "u29", name: "Saad Ullah", email: "saad.u@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saad", plan: "Premium", joinedDate: "2024-03-25", status: "Active", booksRead: 19, totalPages: 2800, readingTime: "35h 30m", streak: 16, country: "Bangladesh" },
  { id: "u30", name: "Mehwish Fatima", email: "mehwish.f@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehwish", plan: "Free", joinedDate: "2024-05-05", status: "Banned", booksRead: 0, totalPages: 0, readingTime: "0h", streak: 0, country: "Turkey" },
  { id: "u31", name: "Waleed Khan", email: "waleed.k@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=waleed", plan: "Premium", joinedDate: "2024-01-10", status: "Active", booksRead: 40, totalPages: 5800, readingTime: "78h 20m", streak: 60, country: "Pakistan" },
  { id: "u32", name: "Rimsha Tariq", email: "rimsha.t@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rimsha", plan: "Lifetime", joinedDate: "2023-12-01", status: "Active", booksRead: 53, totalPages: 7800, readingTime: "112h 40m", streak: 85, country: "India" },
  { id: "u33", name: "Adil Shah", email: "adil.s@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adil", plan: "Free", joinedDate: "2024-06-20", status: "Active", booksRead: 1, totalPages: 150, readingTime: "2h 30m", streak: 1, country: "Canada" },
  { id: "u34", name: "Saima Iqbal", email: "saima.i@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saima", plan: "Premium", joinedDate: "2024-04-22", status: "Active", booksRead: 17, totalPages: 2500, readingTime: "32h 15m", streak: 14, country: "UK" },
  { id: "u35", name: "Jawad Mirza", email: "jawad.m@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jawad", plan: "Lifetime", joinedDate: "2023-09-20", status: "Active", booksRead: 75, totalPages: 9800, readingTime: "165h 30m", streak: 135, country: "UAE" },
  { id: "u36", name: "Kanwal Rehman", email: "kanwal.r@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kanwal", plan: "Free", joinedDate: "2024-05-28", status: "Active", booksRead: 7, totalPages: 950, readingTime: "12h 45m", streak: 6, country: "USA" },
  { id: "u37", name: "Nasir Mahmood", email: "nasir.m@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nasir", plan: "Premium", joinedDate: "2024-02-28", status: "Active", booksRead: 30, totalPages: 4400, readingTime: "60h 10m", streak: 44, country: "Saudi Arabia" },
  { id: "u38", name: "Tabassum Ali", email: "tabassum.a@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tabassum", plan: "Free", joinedDate: "2024-06-08", status: "Suspended", booksRead: 3, totalPages: 350, readingTime: "4h 50m", streak: 1, country: "Pakistan" },
  { id: "u39", name: "Ghulam Mustafa", email: "ghulam.m@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ghulam", plan: "Lifetime", joinedDate: "2023-08-28", status: "Active", booksRead: 88, totalPages: 11200, readingTime: "195h 50m", streak: 160, country: "Bangladesh" },
  { id: "u40", name: "Asma Siddiq", email: "asma.s@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=asma", plan: "Premium", joinedDate: "2024-03-08", status: "Active", booksRead: 22, totalPages: 3200, readingTime: "44h 20m", streak: 20, country: "Turkey" },
  { id: "u41", name: "Faisal Iqbal", email: "faisal.i@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=faisal", plan: "Free", joinedDate: "2024-05-15", status: "Active", booksRead: 9, totalPages: 1300, readingTime: "16h 30m", streak: 7, country: "India" },
  { id: "u42", name: "Sobia Khan", email: "sobia.k@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sobia", plan: "Premium", joinedDate: "2024-01-25", status: "Active", booksRead: 38, totalPages: 5600, readingTime: "74h 45m", streak: 62, country: "UAE" },
  { id: "u43", name: "Zahid Raza", email: "zahid.r@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zahid", plan: "Lifetime", joinedDate: "2023-11-15", status: "Active", booksRead: 62, totalPages: 9000, readingTime: "138h 15m", streak: 105, country: "Canada" },
  { id: "u44", name: "Naila Akhtar", email: "naila.a@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=naila", plan: "Free", joinedDate: "2024-06-12", status: "Active", booksRead: 4, totalPages: 550, readingTime: "7h 15m", streak: 3, country: "UK" },
  { id: "u45", name: "Tauseef Qamar", email: "tauseef.q@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tauseef", plan: "Premium", joinedDate: "2024-02-20", status: "Active", booksRead: 26, totalPages: 3900, readingTime: "52h 10m", streak: 30, country: "Pakistan" },
  { id: "u46", name: "Rukhsana Begum", email: "rukhsana.b@hotmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rukhsana", plan: "Free", joinedDate: "2024-05-22", status: "Banned", booksRead: 0, totalPages: 0, readingTime: "0h", streak: 0, country: "USA" },
  { id: "u47", name: "Imran Hashmi", email: "imran.h@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=imran", plan: "Premium", joinedDate: "2024-04-01", status: "Active", booksRead: 20, totalPages: 3000, readingTime: "40h 20m", streak: 18, country: "Saudi Arabia" },
  { id: "u48", name: "Fouzia Malik", email: "fouzia.m@outlook.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouzia", plan: "Lifetime", joinedDate: "2023-10-10", status: "Active", booksRead: 70, totalPages: 9600, readingTime: "155h 30m", streak: 125, country: "UAE" },
  { id: "u49", name: "Shahid Butt", email: "shahid.b@gmail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shahid", plan: "Free", joinedDate: "2024-06-05", status: "Active", booksRead: 5, totalPages: 700, readingTime: "9h 30m", streak: 4, country: "Bangladesh" },
  { id: "u50", name: "Rabia Naz", email: "rabia.n@yahoo.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rabianaz", plan: "Premium", joinedDate: "2024-03-18", status: "Active", booksRead: 16, totalPages: 2400, readingTime: "30h 40m", streak: 13, country: "Turkey" },
];

export const mockReviews: AdminReview[] = [
  { id: "r1", bookId: 1, bookTitle: "Complete Guide to Hajj", userId: "u1", userName: "Ahmed Khan", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed", rating: 5, text: "Excellent guide for anyone planning Hajj. Very detailed and helpful.", date: "2024-06-20", status: "Approved" },
  { id: "r2", bookId: 2, bookTitle: "Umrah Step by Step", userId: "u2", userName: "Fatima Ali", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima", rating: 4, text: "Great resource for first-time Umrah pilgrims. Highly recommended.", date: "2024-06-19", status: "Approved" },
  { id: "r3", bookId: 5, bookTitle: "Seerah of Prophet Muhammad", userId: "u3", userName: "Omar Hassan", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar", rating: 3, text: "Good content but could use better formatting.", date: "2024-06-18", status: "Pending" },
  { id: "r4", bookId: 8, bookTitle: "Tafsir of Surah Fatiha", userId: "u4", userName: "Ayesha Malik", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayesha", rating: 5, text: "Mind-blowing explanation of the opening surah. Must read!", date: "2024-06-18", status: "Approved" },
  { id: "r5", bookId: 12, bookTitle: "Islamic Finance Basics", userId: "u5", userName: "Zain Abbas", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zain", rating: 2, text: "Very basic content, not what I expected for the price.", date: "2024-06-17", status: "Pending" },
  { id: "r6", bookId: 15, bookTitle: "Muslim Parenting Guide", userId: "u6", userName: "Mariam Siddiqui", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariam", rating: 5, text: "Changed my perspective on raising children. JazakAllah!", date: "2024-06-17", status: "Approved" },
  { id: "r7", bookId: 18, bookTitle: "Tibb-e-Nabawi Remedies", userId: "u7", userName: "Ibrahim Qureshi", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim", rating: 4, text: "Authentic remedies from Sunnah. Well researched.", date: "2024-06-16", status: "Approved" },
  { id: "r8", bookId: 22, bookTitle: "Hijab Stories", userId: "u8", userName: "Sana Rafiq", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sana", rating: 5, text: "Beautiful and inspiring stories of sisterhood and faith.", date: "2024-06-16", status: "Approved" },
  { id: "r9", bookId: 25, bookTitle: "Youth Islamic Identity", userId: "u9", userName: "Hamza Farooq", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hamza", rating: 4, text: "Helped me understand my identity as a Muslim youth.", date: "2024-06-15", status: "Pending" },
  { id: "r10", bookId: 28, bookTitle: "Prophet Stories for Kids", userId: "u10", userName: "Nadia Javed", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nadia", rating: 5, text: "My kids absolutely love this book! Beautiful illustrations.", date: "2024-06-15", status: "Approved" },
  { id: "r11", bookId: 31, bookTitle: "Life After Death", userId: "u11", userName: "Tariq Mahmood", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tariq", rating: 4, text: "Eye-opening book about the hereafter. Very thought-provoking.", date: "2024-06-14", status: "Approved" },
  { id: "r12", bookId: 33, bookTitle: "Dawah Techniques", userId: "u12", userName: "Rabia Akhtar", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rabia", rating: 1, text: "This is spam content. Please remove this review.", date: "2024-06-14", status: "Rejected" },
  { id: "r13", bookId: 36, bookTitle: "Halal Cooking Guide", userId: "u13", userName: "Kamran Shah", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kamran", rating: 4, text: "Delicious recipes with clear instructions. Love it!", date: "2024-06-13", status: "Approved" },
  { id: "r14", bookId: 40, bookTitle: "AI in Islamic World", userId: "u14", userName: "Hina Tariq", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hina", rating: 5, text: "Fascinating look at how AI intersects with Islamic ethics.", date: "2024-06-13", status: "Pending" },
  { id: "r15", bookId: 42, bookTitle: "Islamic Travel Guide", userId: "u15", userName: "Bilal Ahmed", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bilal", rating: 3, text: "Useful but missing some recent destinations.", date: "2024-06-12", status: "Pending" },
  { id: "r16", bookId: 45, bookTitle: "Muslim Mental Health", userId: "u16", userName: "Samina Kausar", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=samina", rating: 5, text: "Much needed book on mental health from Islamic perspective.", date: "2024-06-12", status: "Approved" },
  { id: "r17", bookId: 48, bookTitle: "Marriage in Islam", userId: "u17", userName: "Usman Ghani", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=usman", rating: 4, text: "Practical advice for Muslim couples. Very beneficial.", date: "2024-06-11", status: "Approved" },
  { id: "r18", bookId: 50, bookTitle: "Startup Guide for Muslims", userId: "u18", userName: "Laila Noor", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laila", rating: 5, text: "Amazing resource for aspiring Muslim entrepreneurs!", date: "2024-06-11", status: "Approved" },
  { id: "r19", bookId: 55, bookTitle: "Quran & Science", userId: "u19", userName: "Rashid Iqbal", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rashid", rating: 5, text: "Bridges science and Quran beautifully. Masterpiece!", date: "2024-06-10", status: "Approved" },
  { id: "r20", bookId: 58, bookTitle: "Self Defense for Muslims", userId: "u20", userName: "Yasmin Bano", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yasmin", rating: 3, text: "Decent techniques but need more visual demonstrations.", date: "2024-06-10", status: "Pending" },
  { id: "r21", bookId: 60, bookTitle: "Effective Communication", userId: "u21", userName: "Arif Rehman", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arif", rating: 2, text: "Not very helpful. Generic advice found everywhere.", date: "2024-06-09", status: "Flagged" },
  { id: "r22", bookId: 63, bookTitle: "Islamic Art History", userId: "u22", userName: "Salma Hayat", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=salma", rating: 5, text: "Stunning visuals and rich historical context. A gem!", date: "2024-06-09", status: "Approved" },
  { id: "r23", bookId: 65, bookTitle: "Muslim Fitness Guide", userId: "u23", userName: "Danish Ali", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=danish", rating: 4, text: "Great workout routines that fit around prayer times.", date: "2024-06-08", status: "Approved" },
  { id: "r24", bookId: 68, bookTitle: "Sufism Explained", userId: "u24", userName: "Shazia Perveen", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shazia", rating: 5, text: "Deep and spiritual journey into Sufi traditions.", date: "2024-06-08", status: "Approved" },
  { id: "r25", bookId: 70, bookTitle: "Islamic General Knowledge", userId: "u25", userName: "Mohsin Raza", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohsin", rating: 4, text: "Fun facts and trivia about Islamic history and culture.", date: "2024-06-07", status: "Pending" },
  { id: "r26", bookId: 72, bookTitle: "Aqeedah Fundamentals", userId: "u26", userName: "Amna Khalid", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amna", rating: 5, text: "Clear and concise explanation of Islamic beliefs.", date: "2024-06-07", status: "Approved" },
  { id: "r27", bookId: 75, bookTitle: "Daily Duas Collection", userId: "u27", userName: "Farhan Qadir", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=farhan", rating: 4, text: "Handy collection of daily supplications with transliteration.", date: "2024-06-06", status: "Approved" },
  { id: "r28", bookId: 78, bookTitle: "Seerah for Beginners", userId: "u28", userName: "Noreen Anwar", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noreen", rating: 5, text: "Perfect introduction to the life of Prophet Muhammad (PBUH).", date: "2024-06-06", status: "Approved" },
  { id: "r29", bookId: 80, bookTitle: "Hadith Study Guide", userId: "u29", userName: "Saad Ullah", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saad", rating: 3, text: "Good content but organization could be improved.", date: "2024-06-05", status: "Pending" },
  { id: "r30", bookId: 82, bookTitle: "Islamic Ethics in AI", userId: "u30", userName: "Mehwish Fatima", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehwish", rating: 1, text: "Inappropriate content detected. Needs moderation.", date: "2024-06-05", status: "Flagged" },
  { id: "r31", bookId: 85, bookTitle: "Ramadan Planner", userId: "u31", userName: "Waleed Khan", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=waleed", rating: 5, text: "Essential for every Ramadan. Beautifully designed planner.", date: "2024-06-04", status: "Approved" },
  { id: "r32", bookId: 88, bookTitle: "Zakat Guide", userId: "u32", userName: "Rimsha Tariq", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rimsha", rating: 4, text: "Simple and clear explanation of Zakat calculation.", date: "2024-06-04", status: "Approved" },
  { id: "r33", bookId: 90, bookTitle: "Hajj Stories", userId: "u33", userName: "Adil Shah", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adil", rating: 4, text: "Inspiring personal accounts from Hajj pilgrims.", date: "2024-06-03", status: "Approved" },
  { id: "r34", bookId: 92, bookTitle: "Tafsir Juz Amma", userId: "u34", userName: "Saima Iqbal", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saima", rating: 5, text: "Excellent for children learning the last juz of Quran.", date: "2024-06-03", status: "Approved" },
  { id: "r35", bookId: 95, bookTitle: "Muslim Women Leaders", userId: "u35", userName: "Jawad Mirza", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jawad", rating: 5, text: "Powerful stories of Muslim women throughout history.", date: "2024-06-02", status: "Approved" },
  { id: "r36", bookId: 98, bookTitle: "Islamic Gardening", userId: "u36", userName: "Kanwal Rehman", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kanwal", rating: 3, text: "Interesting concept but limited practical advice.", date: "2024-06-02", status: "Pending" },
  { id: "r37", bookId: 100, bookTitle: "Digital Detox for Muslims", userId: "u37", userName: "Nasir Mahmood", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nasir", rating: 4, text: "Timely reminder about technology usage in modern life.", date: "2024-06-01", status: "Approved" },
  { id: "r38", bookId: 102, bookTitle: "Prayer Workshop", userId: "u38", userName: "Tabassum Ali", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tabassum", rating: 2, text: "Basic information. Not worth the premium price.", date: "2024-06-01", status: "Flagged" },
  { id: "r39", bookId: 105, bookTitle: "Islamic History Timeline", userId: "u39", userName: "Ghulam Mustafa", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ghulam", rating: 5, text: "Comprehensive timeline from revelation to modern era.", date: "2024-05-31", status: "Approved" },
  { id: "r40", bookId: 108, bookTitle: "Quran Memorization Tips", userId: "u40", userName: "Asma Siddiq", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=asma", rating: 5, text: "Helpful techniques for Hifz students and teachers.", date: "2024-05-31", status: "Approved" },
  { id: "r41", bookId: 110, bookTitle: "Halal Business Ethics", userId: "u41", userName: "Faisal Iqbal", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=faisal", rating: 4, text: "Practical framework for running ethical Muslim businesses.", date: "2024-05-30", status: "Pending" },
  { id: "r42", bookId: 112, bookTitle: "Children's Islamic Manners", userId: "u42", userName: "Sobia Khan", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sobia", rating: 5, text: "Teaching kids adab through fun stories and examples.", date: "2024-05-30", status: "Approved" },
  { id: "r43", bookId: 115, bookTitle: "Heavenly Rewards Explained", userId: "u43", userName: "Zahid Raza", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zahid", rating: 4, text: "Motivating content about rewards in the afterlife.", date: "2024-05-29", status: "Approved" },
  { id: "r44", bookId: 118, bookTitle: "Muslim Superhero Stories", userId: "u44", userName: "Naila Akhtar", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=naila", rating: 5, text: "My nephew loves these superhero stories with Islamic values!", date: "2024-05-29", status: "Approved" },
  { id: "r45", bookId: 120, bookTitle: "Sunnah Lifestyle", userId: "u45", userName: "Tauseef Qamar", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tauseef", rating: 4, text: "Simple daily practices to follow Sunnah in modern life.", date: "2024-05-28", status: "Pending" },
  { id: "r46", bookId: 122, bookTitle: "Prophetic Medicine", userId: "u46", userName: "Rukhsana Begum", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rukhsana", rating: 1, text: "Spam review with inappropriate language.", date: "2024-05-28", status: "Rejected" },
  { id: "r47", bookId: 125, bookTitle: "Islamic Marriage Counseling", userId: "u47", userName: "Imran Hashmi", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=imran", rating: 5, text: "Saved my marriage with this counseling guide. Alhamdulillah!", date: "2024-05-27", status: "Approved" },
  { id: "r48", bookId: 128, bookTitle: "Parenting Teenagers", userId: "u48", userName: "Fouzia Malik", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouzia", rating: 4, text: "Practical advice for raising Muslim teens in Western countries.", date: "2024-05-27", status: "Approved" },
  { id: "r49", bookId: 130, bookTitle: "Islamic Geometric Art", userId: "u49", userName: "Shahid Butt", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shahid", rating: 4, text: "Beautiful patterns and easy to follow instructions.", date: "2024-05-26", status: "Approved" },
  { id: "r50", bookId: 135, bookTitle: "Fasting Beyond Ramadan", userId: "u50", userName: "Rabia Naz", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rabianaz", rating: 5, text: "Inspired me to fast on Mondays and Thursdays regularly.", date: "2024-05-26", status: "Approved" },
];

export const activityLog: ActivityLog[] = [
  { id: "a1", action: "New book uploaded", target: "Metaverse ki Haqeeqat", user: "Admin", timestamp: "2 min ago", type: "upload" },
  { id: "a2", action: "User purchased", target: "Ramadan Collection Bundle", user: "Ahmed Khan", timestamp: "5 min ago", type: "purchase" },
  { id: "a3", action: "Review flagged", target: "Inappropriate content", user: "System", timestamp: "12 min ago", type: "review" },
  { id: "a4", action: "5 books updated", target: "New covers uploaded", user: "Admin", timestamp: "1 hour ago", type: "update" },
  { id: "a5", action: "New user signup", target: "Premium plan", user: "Sarah Ahmed", timestamp: "2 hours ago", type: "user" },
  { id: "a6", action: "Category renamed", target: "Hajj & Umrah → Pilgrimage", user: "Admin", timestamp: "3 hours ago", type: "update" },
  { id: "a7", action: "Book published", target: "Islamic Finance 101", user: "Admin", timestamp: "4 hours ago", type: "upload" },
  { id: "a8", action: "Review approved", target: "5-star review on Seerah", user: "Moderator", timestamp: "5 hours ago", type: "review" },
  { id: "a9", action: "Revenue milestone", target: "₨50,000 this quarter", user: "System", timestamp: "6 hours ago", type: "system" },
  { id: "a10", action: "Bulk discount applied", target: "20% off Eid collection", user: "Admin", timestamp: "8 hours ago", type: "update" },
  { id: "a11", action: "User suspended", target: "Policy violation", user: "Moderator", timestamp: "12 hours ago", type: "user" },
  { id: "a12", action: "Newsletter sent", target: "12,450 subscribers", user: "System", timestamp: "1 day ago", type: "system" },
];

export const revenueData: RevenueData[] = [
  { date: "Jan", revenue: 32100 },
  { date: "Feb", revenue: 28500 },
  { date: "Mar", revenue: 34200 },
  { date: "Apr", revenue: 38900 },
  { date: "May", revenue: 41200 },
  { date: "Jun", revenue: 48392 },
];

export const dailyRevenueData: RevenueData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  revenue: Math.floor(800 + Math.random() * 2200),
}));

export const userGrowthData = [
  { month: "Jan", users: 8200 },
  { month: "Feb", users: 9100 },
  { month: "Mar", users: 9800 },
  { month: "Apr", users: 10500 },
  { month: "May", users: 11400 },
  { month: "Jun", users: 12547 },
];

export const categoryDistribution = [
  { name: "Hajj & Umrah", count: 15, color: "#C9A84C" },
  { name: "Quran & Hadith", count: 28, color: "#2A9D8F" },
  { name: "Seerah", count: 22, color: "#C9A84C" },
  { name: "Aqeedah", count: 18, color: "#2A9D8F" },
  { name: "Duas & Supp.", count: 12, color: "#C9A84C" },
  { name: "Islamic Finance", count: 16, color: "#2A9D8F" },
  { name: "Islamic Lifestyle", count: 25, color: "#C9A84C" },
  { name: "Parenting", count: 14, color: "#2A9D8F" },
  { name: "Islamic Health", count: 10, color: "#C9A84C" },
  { name: "Women in Islam", count: 11, color: "#2A9D8F" },
  { name: "Youth & Teens", count: 13, color: "#C9A84C" },
  { name: "Islamic Kids", count: 17, color: "#2A9D8F" },
  { name: "Death & Afterlife", count: 9, color: "#C9A84C" },
  { name: "Dawah", count: 8, color: "#2A9D8F" },
  { name: "Cooking & Food", count: 7, color: "#C9A84C" },
  { name: "AI & Tech", count: 20, color: "#2A9D8F" },
  { name: "Travel", count: 15, color: "#C9A84C" },
  { name: "Psychology", count: 12, color: "#2A9D8F" },
  { name: "Relationships", count: 14, color: "#C9A84C" },
  { name: "Business", count: 19, color: "#2A9D8F" },
  { name: "Science", count: 16, color: "#C9A84C" },
  { name: "Self-Defense", count: 6, color: "#2A9D8F" },
  { name: "Communication", count: 8, color: "#C9A84C" },
  { name: "Arts & Culture", count: 10, color: "#2A9D8F" },
  { name: "Sports & Fitness", count: 11, color: "#C9A84C" },
  { name: "Spirituality", count: 13, color: "#2A9D8F" },
  { name: "General Knowledge", count: 9, color: "#C9A84C" },
];

export const trafficSources = [
  { name: "Organic Search", value: 45, color: "#C9A84C" },
  { name: "Social Media", value: 25, color: "#2A9D8F" },
  { name: "Direct", value: 15, color: "#B87333" },
  { name: "Referral", value: 10, color: "#3A3A4A" },
  { name: "Email", value: 5, color: "#666677" },
];

export const topSellingBooks = [
  { title: "Complete Guide to Hajj", sales: 2847 },
  { title: "Seerah of Prophet Muhammad", sales: 2560 },
  { title: "Tafsir of Surah Fatiha", sales: 2134 },
  { title: "Islamic Finance Basics", sales: 1987 },
  { title: "Muslim Parenting Guide", sales: 1756 },
  { title: "Quran & Science", sales: 1623 },
  { title: "Ramadan Planner", sales: 1545 },
  { title: "Life After Death", sales: 1432 },
  { title: "Daily Duas Collection", sales: 1321 },
  { title: "Seerah for Beginners", sales: 1205 },
];

export const conversionFunnel = [
  { stage: "Visitors", count: 125000 },
  { stage: "Signups", count: 12547 },
  { stage: "Free Users", count: 8400 },
  { stage: "Premium", count: 3200 },
  { stage: "Purchases", count: 3847 },
];

export const recentPurchases = [
  { user: "Ahmed Khan", book: "Ramadan Collection Bundle", price: 29.99, date: "2024-06-20", status: "Completed" },
  { user: "Fatima Ali", book: "Seerah of Prophet Muhammad", price: 12.99, date: "2024-06-19", status: "Completed" },
  { user: "Omar Hassan", book: "Quran Memorization Tips", price: 8.99, date: "2024-06-19", status: "Completed" },
  { user: "Ayesha Malik", book: "Islamic Art History", price: 15.99, date: "2024-06-18", status: "Completed" },
  { user: "Mariam Siddiqui", book: "Muslim Mental Health", price: 14.99, date: "2024-06-18", status: "Completed" },
  { user: "Ibrahim Qureshi", book: "Prophetic Medicine", price: 11.99, date: "2024-06-17", status: "Completed" },
  { user: "Sana Rafiq", book: "Hijab Stories", price: 9.99, date: "2024-06-17", status: "Completed" },
  { user: "Bilal Ahmed", book: "Startup Guide for Muslims", price: 19.99, date: "2024-06-16", status: "Completed" },
];

export const topReaders = [
  { user: "Ibrahim Qureshi", booksRead: 72, pages: 9500, time: "156h 30m", streak: 120 },
  { user: "Ghulam Mustafa", booksRead: 88, pages: 11200, time: "195h 50m", streak: 160 },
  { user: "Rashid Iqbal", booksRead: 81, pages: 10500, time: "180h 45m", streak: 150 },
  { user: "Fouzia Malik", booksRead: 70, pages: 9600, time: "155h 30m", streak: 125 },
  { user: "Shazia Perveen", booksRead: 59, pages: 8600, time: "130h 20m", streak: 100 },
  { user: "Zahid Raza", booksRead: 62, pages: 9000, time: "138h 15m", streak: 105 },
  { user: "Tariq Mahmood", booksRead: 64, pages: 8900, time: "140h 12m", streak: 95 },
  { user: "Noreen Anwar", booksRead: 67, pages: 9300, time: "148h 10m", streak: 110 },
];

export const adminCategories = [
  { id: 1, name: "Hajj & Umrah", icon: "BookOpen", description: "Books about pilgrimage, Hajj, and Umrah rituals", count: 15 },
  { id: 2, name: "Quran & Hadith", icon: "BookOpen", description: "Quran studies, Tafsir, and Hadith collections", count: 28 },
  { id: 3, name: "Seerah", icon: "BookOpen", description: "Life of Prophet Muhammad (PBUH)", count: 22 },
  { id: 4, name: "Aqeedah", icon: "BookOpen", description: "Islamic beliefs and creed", count: 18 },
  { id: 5, name: "Duas & Supplications", icon: "BookOpen", description: "Daily prayers and supplications", count: 12 },
  { id: 6, name: "Islamic Finance", icon: "DollarSign", description: "Halal finance, investment, and economics", count: 16 },
  { id: 7, name: "Islamic Lifestyle", icon: "Heart", description: "Daily life, habits, and Sunnah practices", count: 25 },
  { id: 8, name: "Parenting & Family", icon: "Users", description: "Muslim family and parenting guidance", count: 14 },
  { id: 9, name: "Islamic Health", icon: "Heart", description: "Tibb-e-Nabawi and health practices", count: 10 },
  { id: 10, name: "Women in Islam", icon: "Users", description: "Books about Muslim women and their roles", count: 11 },
  { id: 11, name: "Youth & Teens", icon: "Users", description: "Content for Muslim youth and teenagers", count: 13 },
  { id: 12, name: "Islamic Kids", icon: "Users", description: "Children's Islamic books and stories", count: 17 },
  { id: 13, name: "Death & Afterlife", icon: "BookOpen", description: "Books about death, grave, and hereafter", count: 9 },
  { id: 14, name: "Dawah & Outreach", icon: "MessageSquare", description: "Calling to Islam and outreach methods", count: 8 },
  { id: 15, name: "Cooking & Food", icon: "Heart", description: "Halal cooking and food preparation", count: 7 },
  { id: 16, name: "AI & Technology", icon: "Cpu", description: "Technology from Islamic perspective", count: 20 },
  { id: 17, name: "Travel & Adventure", icon: "Globe", description: "Islamic travel and exploration", count: 15 },
  { id: 18, name: "Psychology", icon: "Brain", description: "Mental health and Islamic psychology", count: 12 },
  { id: 19, name: "Relationships", icon: "Users", description: "Marriage, family, and relationships", count: 14 },
  { id: 20, name: "Business", icon: "Briefcase", description: "Islamic business and entrepreneurship", count: 19 },
  { id: 21, name: "Science", icon: "Atom", description: "Science and Quran", count: 16 },
  { id: 22, name: "Self-Defense", icon: "Shield", description: "Self-defense for Muslims", count: 6 },
  { id: 23, name: "Communication", icon: "MessageSquare", description: "Effective communication skills", count: 8 },
  { id: 24, name: "Arts & Culture", icon: "Palette", description: "Islamic art and cultural heritage", count: 10 },
  { id: 25, name: "Sports & Fitness", icon: "Dumbbell", description: "Muslim fitness and sports", count: 11 },
  { id: 26, name: "Spirituality", icon: "Sparkles", description: "Sufism and spiritual growth", count: 13 },
  { id: 27, name: "General Knowledge", icon: "Lightbulb", description: "Islamic trivia and general knowledge", count: 9 },
];
