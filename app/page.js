import Login from "./(auth)/login/page";
import SAPanel from "./(panels)/super_admin/page";

export default function Home() {
	return (
		<div>
			{/* <Login /> */}
			<SAPanel />
		</div>
	);
}
