import fs from "fs";
import jwt from "jsonwebtoken";

export default class AppleMusic {
    getDeveloperToken() {
        let privateKey = fs.readFileSync("AppleMusicPrivateKey.p8");
        let developerToken = jwt.sign(
            {
                // 10 Character Apple Developer Team ID
                iss: "KED4M385SL"
            },
            privateKey,
            {
                algorithm: "ES256",
                expiresIn: "170 days",
                header: {
                    alg: "ES256",
                    // Apple Music Private Key ID
                    kid: "5UGZ4LJDSK"
                }
            }
        );
        return { developerToken: developerToken };
    }
}
