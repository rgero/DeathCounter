import axios from "axios";
import { getCurrentUser } from "./apiAuthentication";

export const submitFeedback = async ({title, description} : {title: string, description: string}) => {

  const user = await getCurrentUser();
  const userName = user?.user_metadata.fullName;

  const feedbackURL = import.meta.env.VITE_FEEDBACK_URL;
  const targetKey = import.meta.env.VITE_FEEDBACK_KEY;

  const config = {
    headers: {
      "Authorization": targetKey
    }
  }

  if (userName)
  {
    description = description ? `${description}\n\nLogged By ${userName}` : `Logged by ${userName}`
  }

  const feedback = {
    "repo": "rgero/DeathCounter",
    title: title,
    description: description
  }
  await axios.post(feedbackURL, feedback, config);
}