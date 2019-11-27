export const RdGnTable = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
];

export class TablulatedColorBar {
    constructor(table) {
        this.table = table;
    }

    getColor(value) {
        for (var i = 1; i < this.table.length - 1; i++) {
            if (value < this.table[i].pct) {
                break;
            }
        }
        var lower = this.table[i - 1];
        var upper = this.table[i];
        var range = upper.pct - lower.pct;
        var rangePct = (value - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    }
}
