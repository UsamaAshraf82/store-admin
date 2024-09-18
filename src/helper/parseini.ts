import Parse from "parse";

const ParseInit = async () => {
  Parse.enableEncryptedUser();
  Parse.secret = process.env.NEXT_PUBLIC_ENCRYPT_SECRET!;
  Parse.serverURL = "https://parseapi.back4app.com"; // This is your Server URL
  Parse.initialize(
    process.env.NEXT_PUBLIC_PARSE_APP_KEY!, // This is your Application ID
    process.env.NEXT_PUBLIC_PARSE_JS_KEY! // This is your Javascript key
  );

  const Installation = new Parse.Installation();
  Installation.set("deviceType", window?.navigator?.userAgent || "WEB");
  try {
    await Installation.save();
  } catch {}
};
export default ParseInit;
