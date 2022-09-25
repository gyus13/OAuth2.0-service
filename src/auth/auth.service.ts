import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async iosVerifyGoogle(token) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: secret.ios_google_client_id, // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            let data = {};
            const payload = ticket.getPayload();
            const accountId = payload['sub'];

            let user = await this.userRepository.findOne({
                where: { accountId: accountId },
            });
            let accountPayload;

            // 유저가 존재하지 않는 경우
            if (user == undefined) {
                user = await this.userRepository.save({
                    accountId: accountId,
                });
                accountPayload = { sub: user.id };
                data = {
                    accountId: accountId,
                    nickname: null,
                    characterImageUrl: null,
                    token: this.jwtService.sign(accountPayload),
                };
            } else {
                const characterImageUrl = await getManager()
                    .createQueryBuilder(Character, 'characters')
                    .innerJoin(CharacterUser, 'CU', 'characters.id = CU.characterId')
                    .select('characters.characterImageUrl')
                    .where('CU.userId IN (:userId)', { userId: user.id })
                    .getOne();

                accountPayload = { sub: user.id };
                if (characterImageUrl == undefined) {
                    data = {
                        accountId: accountId,
                        nickname: user.nickname,
                        characterImageUrl: null,
                        token: this.jwtService.sign(accountPayload),
                    };
                } else {
                    data = {
                        accountId: accountId,
                        nickname: user.nickname,
                        characterImageUrl: characterImageUrl.characterImageUrl,
                        token: this.jwtService.sign(accountPayload),
                    };
                }
            }

            const result = makeResponse(response.SUCCESS, data);

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            // Rollback
            await queryRunner.rollbackTransaction();
            return response.ERROR;
        } finally {
            await queryRunner.release();
        }
    }
}
