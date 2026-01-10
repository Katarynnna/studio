
import AppLayout from "@/components/app/app-layout";
import MainView from "@/components/app/main-view";
import type { Dispatch, SetStateAction } from "react";

type HomeProps = {
  setProfileOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function Home({ setProfileOpen }: HomeProps) {
  return (
    <AppLayout>
      <MainView />
    </AppLayout>
  );
}
