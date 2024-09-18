import Parse from "parse/node";
let ParseServer: typeof Parse | null = null;

const ParseInitServer = async () => {
  if (ParseServer) return ParseServer;

  Parse.serverURL = "https://parseapi.back4app.com"; // This is your Server URL
  Parse.masterKey = process.env.PARSE_MASTER_KEY;
  Parse.initialize(
    process.env.NEXT_PUBLIC_PARSE_APP_KEY!, // This is your Application ID
    process.env.NEXT_PUBLIC_PARSE_JS_KEY!, // This is your Javascript key
    process.env.PARSE_MASTER_KEY! // This is your Javascript key
  );
  const Installation = new Parse.Installation();
  Installation.set("deviceType", "NODE");
  await Installation.save();
  ParseServer = Parse;
  return Parse;
};
export default ParseInitServer;
