import { SideBar } from "@/components/sidebar";
import { TextArea } from "@/components/textarea";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-col flex-1 p-4 min-h-full border-r-1 border-orange-500 gap-2">
        <div className="flex w-full h-12">
          <button className="border-orange-500 border-1 px-4">Save</button>
        </div>
        <TextArea />
      </div>
      <SideBar />
    </div>
  );
}
