const { CodeartifactClient, GetAuthorizationTokenCommand } = require("@aws-sdk/client-codeartifact");

const fs = require('fs');
const client = new CodeartifactClient({ "region": "us-east-1" });
const command = new GetAuthorizationTokenCommand({
  "domain": "rl-domain"
});
const template = "@rl:registry=https://rl-domain-747865543072.d.codeartifact.us-east-1.amazonaws.com/npm/rl-dev-fe/\n" + "//rl-domain-747865543072.d.codeartifact.us-east-1.amazonaws.com/npm/rl-dev-fe/:always-auth=true\n" + "//rl-domain-747865543072.d.codeartifact.us-east-1.amazonaws.com/npm/rl-dev-fe/:_authToken="

client.send(command).then(value => {
  const content = template + value.authorizationToken;
  var isWin = process.platform === "win32";
  if (isWin) {
    fs.writeFile("..\\.npmrc", content, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  } else {
    fs.writeFile("../.npmrc", content, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
}, err => {
  console.log("An error has ocurred at requesting the token: ", err);
});