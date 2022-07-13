import banpv from "./banpv";
import monan from "./monan";
import phieudat from "./phieudat";

phieudat.belongsTo(banpv, {
    foreignKey: 'phucvuid'
});

export default {
    monan,
    phieudat
}