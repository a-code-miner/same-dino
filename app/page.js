import Login from "./(auth)/login/page";
import UsersManagement from "./(panels)/super_admin/users/page";

export default function Home() {
	return (
		<div>
			{/* <Login /> */}
			<UsersManagement />
		</div>
	);
}
