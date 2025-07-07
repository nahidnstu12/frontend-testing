import FrontendLayout from "@/layouts/frontend-layout";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    axios.get("http://localhost:8081/api/hello").then((res) => {
      console.log(res.data);
    });
  }, []);

  return (
    <FrontendLayout>
      <h1>Home Page</h1>
    </FrontendLayout>
  );
}
