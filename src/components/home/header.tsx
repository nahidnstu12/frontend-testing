import { Button } from "../ui/button";
import NavMenu from "./nav-menu";
import logo from "@/assets/images/logo.png";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-10 py-5">
      <div className="w-52 h-20 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="w-full h-full" />
        {/* <p className="text-2xl font-bold text-[#202674]">HHH</p> */}
      </div>
      <NavMenu />
      <Button variant={"destructive"} className="rounded-sm w-40 cursor-pointer" onClick={() => navigate("/applicant-registration")}>Register</Button>
    </div>
  );
}