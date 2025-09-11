/**
 * Viết constants để call api
 * Author SonPV
 * Created 05/09/2025
 */

export const API_CONSTANTS = {
    VEHICLE: {
        GROUP: '/vehicle/groups',
        GROUP_BY_GROUPID: '/vehicle/group',
        VEHICLE_VEHICLE: '/vehicle/vehicles',
        VEHICLE_VEHICLE_BY_VEHICLEID: '/vehicle/vehicle',
        VEHICLE_GROUP: '/vehicle/vehicle-groups',
        VEHICLE_IMAGE: '/vehicle/vehicle-images'
    },
    VEHICLE_GROUP: {
        LIST_ADMIN_USER: '/vehicle-group/users',
        LIST_AVAILABLE_VEHICLE_GROUP: '/vehicle-group/available-groups',
        LIST_ASSIGN_VEHICLE_GROUP: '/vehicle-group/assigned-groups',
        ASSIGN_VEHICLE_GROUP: '/vehicle-group/assign',
        AVAILABLE_VEHICLE_GROUP: '/vehicle-group/unassign'
    }
}