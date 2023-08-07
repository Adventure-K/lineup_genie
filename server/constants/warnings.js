const badSecret = `
----------------------------

*** WARNING ***
Your application is not very secure.
You need to set SERVER_SESSION_SECRET to a better secret
Please add a .env file

It should be
- longer than 8 characters
- not "superDuperSecret"

If this warning is showing,
add or change your SERVER_SESSION_SECRET environment variable!

----------------------------`;

const exampleBadSecret = 'superDuperSecret';

export default {
  badSecret,
  exampleBadSecret,
};
