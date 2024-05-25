import { RecaptchaV2 } from "express-recaptcha";
import "../../env.js"

console.log(process.env.RECAPTCHA_SECRET_KEY);
console.log(process.env.RECAPTCHA_SITE_KEY);
const recaptcha = new RecaptchaV2(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)

export default recaptcha