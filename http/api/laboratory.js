const install = (vm) => {
    return {
        brandRoomInfo(params = {}) { // 有房间信息_实验室绑定的房间信息列表
            return vm.$u.post('/iot-ysa-laboratory/laboratory/labFontEnd/brandRoomInfo', params)
        },
        userLabRoomInfo(params = {}) { // 个人中心_实验室信息
            return vm.$u.post('/iot-ysa-laboratory/laboratory/labFontEnd/userLabRoomInfo', params)
        },
        userLabRoomInfoList(params = {}) { // 实验室信息列表
            return vm.$u.post('/iot-ysa-laboratory/laboratory/labFontEnd/userLabRoomInfoList', params)
        },
        delRoomByIds(params = {}) { // 批量删除房间并解绑设备
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/delRoomByIds', params)
        },
        batchSelectLabBand(params = {}) { //批量删除查询实验室是否绑定房间
            return vm.$u.post('/iot-ysa-laboratory/laboratory/labManagement/batchSelectLabBand', params)
        }
    }
}

export default {
    install
}
