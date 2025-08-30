import "./globals.css";
import Sidebar from "@/components/Sidebar";


export default function RootLayout({ children }) {
	return (
		<html lang="fa" dir="rtl">
			<body>
				<Sidebar />
				{children}
			</body>
		</html>
	);
}
