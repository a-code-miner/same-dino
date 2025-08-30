import Login from "./(auth)/login/page";
import SAPanel from "./(panels)/super_admin/page";
import Sidebar from "@/components/Sidebar";

export default function Home() {
	return (
		<div>
			{/* <Login /> */}
			<Sidebar />
			<SAPanel />
		</div>
	);
}
