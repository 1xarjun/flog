import { Outlet } from "react-router";
import Header from "./Header";
import EditorProvider from "./context/editor-provider";

export default function RootLayout() {
  return (
    <div className="text-gray-700">
      <Header />
      <div className="pt-14 bg-[#fefefe]">
        <EditorProvider>
          <Outlet />
        </EditorProvider>
      </div>
    </div>
  );
}
