export default function LeaderboardSort(general){
    if (general[1][0] >= general[0][0] && general[1][0] >= general[2][0] && general[1][0] >= general[3][0]){
        let temp = general[0];
        general[0] = general[1];
        general[1] = temp;
    } else if (general[2][0] >= general[0][0] && general[2][0] >= general[1][0] && general[2][0] >= general[3][0]){
        let temp = general[0];
        general[0] = general[2];
        general[2] = temp;
    } else if (general[3][0] >= general[0][0] && general[3][0] >= general[1][0] && general[3][0] >= general[2][0]){
        let temp = general[0];
        general[0] = general[3];
        general[3] = temp;
    }

    if (general[2][0] >= general[1][0] && general[2][0] >= general[3][0]){
        let temp = general[1];
        general[1] = general[2];
        general[2] = temp;
    } else if (general[3][0] >= general[1][0] && general[3][0] >= general[2][0]){
        let temp = general[1];
        general[1] = general[3];
        general[3] = temp;
    }

    if (general[3][0] >= general[2][0]){
        let temp = general[2];
        general[2] = general[3];
        general[3] = temp;
    }

    return general;
}