import ProfileInfo from "../../components/profile/Info";
import ProfileTab from "../../components/profile/Tab";

export default function ProfilePage() {
  return (
    <main className="self-center flex-1 flex flex-col space-y-8  py-24">
      <ProfileInfo />
      <ProfileTab />
    </main>
  );
}
