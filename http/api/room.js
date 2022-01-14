const install = (vm) => {
    return {
        equipStatisticInfo(params = {}) { // 房间详情统计设备
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/equipStatisticInfo', params)
        },
        equipStatisticInfos(params = {}) { // 房间设备列表
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/equipStatisticInfos', params)
        },
        equipStatus(params = {}) { // 根据绑定的房间id获取房间最新一条日志记录
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/getLabBrandRoomWarnLog', params)
        },
        roomOneKeyOpenClose(params = {}) { // 房间详情_一键开关
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/roomOneKeyOpenClose', params)
        },
        queryOperationLogList(params = {}) { // 房间详情_房间操作日志
            return vm.$u.post('/iot-ysa-equipment/operationLog/queryOperationLogList', params)
        },
        getCmdlogList(params = {}) { // 房间详情_房间状态记录
            return vm.$u.post('/iot-ysa-cat/icInstruCmdlog/getCmdlogList', params)
        },
        roomEquipShareMembers(params = {}) { // 房间详情_共享成员
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/roomEquipShareMembers', params)
        },
        roomEquipSharDelete(params = {}) { // 房间详情_删除共享成员
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/roomEquipSharDelete', params)
        },
        selRoomBandEquip(params = {}) { // 查询房间可绑定仪器
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/selRoomBandEquip', params)
        },
        batchSelectRoomBand(params = {}) { //批量删除查询房间是否绑定设备
            return vm.$u.post('/iot-ysa-room/room/roomManage/batchSelectRoomBand', params)
        },
        editRoom(params = {}) { // 房间详情修改
            return vm.$u.post('/iot-ysa-room/room/roomFontEnd/editRoom', params)
        },
        queryEquipIdsByInstruIds(params = {}) { // 通过仪器ids查询所绑定设备ids
            return vm.$u.post('/iot-ysa-equipment/equipment/devEquipFontEndInfo/queryEquipIdsByInstruIds', params)
        }
    }
}

export default {
    install
}
