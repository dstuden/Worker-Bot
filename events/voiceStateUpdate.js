const GuildUser = require('../models/guildUser');
const mongoose = require('mongoose');

module.exports = async (client, old_state, new_state) => {
    const new_channel = new_state.channel;
    const old_channel = old_state.channel;

    const user = client.users.cache.find(u => u.id === new_state.id);

    if (old_channel === null && new_channel !== null) { // join
        await GuildUser.findOneAndUpdate({ userID: user.id }, { joinTimeStamp: Date.now() });
    }
    if (new_channel === null) { // leave
        const userInfo = await GuildUser.findOne({
            userID: new_state.id,
        }).catch(err => {
            console.error(err)
        });
<<<<<<< HEAD
        let joinTime = 0;
        if (userInfo)
            joinTime = userInfo.joinTimeStamp;

        let time_in_vc = 0;
        if (joinTime !== 0)
            time_in_vc = Date.now() - joinTime;

=======
        let joinTime = 0.0;
        if (userInfo)
            joinTime = userInfo.joinTimeStamp;

        let time_in_vc = 0.0;
        if (joinTime !== 0)
            time_in_vc = Math.ceil((Date.now() - joinTime) / 1000);

        console.log(time_in_vc);
>>>>>>> master
        if (userInfo === null) {
            const newUser = new GuildUser({
                _id: mongoose.Types.ObjectId(),
                username: user.tag,
                userID: user.id,
                messages: 0,
                voiceTime: time_in_vc,
                joinTimeStamp: 0
            })

            newUser.save()
                .catch(err => console.error(err));
        }
        else {
            let all_voice_time = userInfo.voiceTime + time_in_vc;
<<<<<<< HEAD
            await GuildUser.findOneAndUpdate({ userID: user.id }, { voiceTime: all_voice_time })
=======
            await GuildUser.findOneAndUpdate({ userID: user.id }, { voiceTime: all_voice_time, joinTimeStamp: 0 });
>>>>>>> master
        }
    }

}
