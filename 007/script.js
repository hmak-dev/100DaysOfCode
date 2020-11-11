const { sin, cos, PI } = Math;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const { innerWidth: vw, innerHeight: vh } = window;

canvas.width = 350;
canvas.height = 700;

const cx = canvas.width / 2;
const cy = canvas.height / 2;

const height = 600;
const width = 250;
const radius = 110;
const sinePartsCount = 21;
const jointEvery = 2;
const jointEveryReminder = 1;
const jointPartsCount = 5;
const clusterPairsCount = [2, 5];
const clusterDotSize = [2, 2.5];
const clusterScatterRadius = [-20, 20];
const dotMovementRadius = [-10, 10];
const dotMovementSpeed = [-5, 5];
let startAngle = PI / 2;

let clusters = {
    leftSine: [],
    rightSine: [],
    joints: [],
};

function rand(lo, hi) {
    return Math.random() * (hi - lo) + lo;
}

class Dot {
    x = 0;
    ix = 0;

    y = 0;
    iy = 0;

    r = 0;
    ir = 0;

    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.ix = x;
        this.iy = y;
        this.r = r;
        this.ir = rand(...dotMovementRadius)
        this.am = rand(...dotMovementSpeed)
    }
}

class Cluster {
    type = '';
    x = 0;
    y = 0;
    dots = [];

    constructor(type, x, y) {
        this.x = x;
        this.y = y;
        this.type = type;

        for (let i = 0; i < rand(...clusterPairsCount); i++) {
            const radius = rand(...clusterDotSize);

            this.dots.push([
                new Dot(rand(...clusterScatterRadius), rand(...clusterScatterRadius), radius),
                new Dot(rand(...clusterScatterRadius), rand(...clusterScatterRadius), radius)
            ])
        }
    }
}

function generateClusters() {
    let angle = startAngle;
    const heightDiff = height / sinePartsCount;
    const angelDiff = (PI * 2) / sinePartsCount;
    const xFix = (width / 2) - radius;
    const h2 = height / 2;

    for (let i = 0; i < sinePartsCount; i++) {
        const c1 = new Cluster(
            'lsin',
            cx + sin(angle) * radius + xFix,
            cy - h2 + heightDiff * i
        );

        const c2 = new Cluster(
            'rsin',
            cx - sin(angle) * radius - xFix,
            cy - h2 + heightDiff * i
        );

        clusters.leftSine.push(c1);
        clusters.rightSine.push(c2);

        if (i % jointEvery === jointEveryReminder) {
            const jointClusters = [];
            const dx = (c2.x - c1.x) / jointPartsCount;

            for (let j = 1; j < jointPartsCount; j++) {
                jointClusters.push(new Cluster(
                    'joint',
                    c1.x + dx * j,
                    c2.y
                ));
            }

            clusters.joints.push(jointClusters);
        }

        angle += angelDiff;
    }
}

function repositionClusters() {
    let angle = startAngle;
    const angelDiff = (PI * 2) / sinePartsCount;

    for (let i = 0; i < sinePartsCount; i++) {
        const lsc = clusters.leftSine[i];
        const rsc = clusters.rightSine[i];

        lsc.x = cx + sin(angle) * radius + (width / 2 - radius);
        rsc.x = cx - sin(angle) * radius - (width / 2 - radius);


        if (i % jointEvery === jointEveryReminder) {
            const jointClusters = clusters.joints[Math.floor(i / jointEvery)];
            const dx = (rsc.x - lsc.x) / jointPartsCount;

            for (let j = 1; j < jointPartsCount; j++) {
                const jc = jointClusters[j - 1];

                jc.x = lsc.x + dx * j;
            }
        }

        angle += angelDiff;
    }

    const sas = sin(startAngle);
    const sac = cos(startAngle);
    for (let c of Object.values(clusters).flat(2)) {
        for (let [d1, d2] of c.dots) {
            d1.x = d1.ix + sin(startAngle * d1.am) * d1.ir;
            d1.y = d1.iy + cos(startAngle * d1.am) * d1.ir;

            d2.x = d2.ix + sin(startAngle * d2.am) * d2.ir;
            d2.y = d2.iy + cos(startAngle * d2.am) * d2.ir;
        }
    }
}

function drawDots() {
    ctx.clearRect(0, 0, vw, vh);

    for (let c of Object.values(clusters).flat(2)) {
        for (let [d1, d2] of c.dots) {
            ctx.globalAlpha = 0.25;

            ctx.beginPath();
            ctx.moveTo(c.x + d1.x, c.y + d1.y);
            ctx.lineTo(c.x + d2.x, c.y + d2.y);
            ctx.stroke();

            ctx.globalAlpha = 0.75;

            ctx.beginPath();
            ctx.arc(c.x + d1.x, c.y + d1.y, d1.r, 0, PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(c.x + d2.x, c.y + d2.y, d2.r, 0, PI * 2);
            ctx.fill();
        }
    }
}

let anim;
function animate() {
    startAngle += 0.003;
    repositionClusters();
    drawDots();

    anim = requestAnimationFrame(animate);
}

generateClusters();
drawDots();
animate();
