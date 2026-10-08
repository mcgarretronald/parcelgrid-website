import { MiniFaq } from "./MiniFaq";
import { HOME_FAQ } from "../lib/faqData";

export function HomeFaq() {
  return (
    <MiniFaq
      id="home-faq"
      items={HOME_FAQ}
      description="The essentials before you book. Need more detail? Browse every topic or talk to our team."
    />
  );
}
