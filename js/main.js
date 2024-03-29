// armor skill item limit to 5,
const VERSION_CODE = {
    "15.0.1": "129E11F8",
    "16.0.0": "12A4FD80",
}
const ARMOR_SKILL_LIMIT = 5;

const DEF_MAP = Object.keys(k_skill_def_map);

const SKILL_ADD_HEX = ["90", "91", "92", "93", "94"];

var k_result = {
    eq_id: "",
    eq_name: "",
    eq_part_id: 0,
    eq_pos: 0,
    eq_pos_hex: "00",
    eq_slot: "000",
    eq_k_slot: "000",
    eq_cost: 0,
    eq_pool_id: 0,
    def: { origin: 0, delta: 0 },
    def_f: { origin: 0, delta: 0 },
    def_w: { origin: 0, delta: 0 },
    def_t: { origin: 0, delta: 0 },
    def_i: { origin: 0, delta: 0 },
    def_d: { origin: 0, delta: 0 },
    eq_origin_skill: {
        // "skill name": origin level,
    },
    eq_origin_skill_set: new Set(),
    eq_skill_set: new Set(),
    eq_skill: {
        // "skill name": level,
    },
    k_skill: [
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
        { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 },
    ]
};

// fill armor position <select>
armor_pos = document.getElementById("armor_pos");
for (let i = 0; i < 10; i++) {
    let eq_pos_hex = 32;
    eq_pos_hex = eq_pos_hex + i * 8;
    let opt = document.createElement("option");
    eq_pos = i + 1;
    opt.value = `${eq_pos_hex.toString(16)}_${eq_pos}`;
    opt.text = `${eq_pos}`;
    armor_pos.appendChild(opt);
}
armor_pos.addEventListener("change", (event) => {
    let eq_position = event.target.value.split("_");
    k_result["eq_pos"] = eq_position[1];
    k_result["eq_pos_hex"] = eq_position[0];
});

part_sel = document.getElementById("part_select");
armor_sel = document.getElementById("armor_select");

part_sel.addEventListener("change", (event) => {
    k_result["eq_part_id"] = event.target.value;
    const opt_placeholder = document.createElement("option");
    opt_placeholder.value = "0";
    opt_placeholder.text = "-----"
    armor_sel.replaceChildren(opt_placeholder);
    for (let i in armor_list) {
        var o = armor_list[i];
        if (o["rank"] > 7 && o["bougyo"] > 0 && o["parts_id"] == k_result["eq_part_id"]) {
            let opt = document.createElement("option");
            opt.value = o["id"].toString() + "_" + o["parts_id"].toString();
            opt.text = o["name"];
            armor_sel.appendChild(opt);
        }
    }
    armor_sel.disabled = false;
});

armor_sel.addEventListener("change", (event) => {
    let armor_id = event.target.value;
    var armor_data = armor_list[armor_id];

    // initial k_result, render div
    init(armor_id, armor_data);

    k_skills = k_skill_add[k_result["eq_pool_id"].toString()];

    for (let i = 0; i < 7; i++) {
        let k_skill_sel = document.getElementById(`k_skill_${i}`);
        k_skill_sel.disabled = false;
        k_skill_sel.innerHTML = `<option value="00_0">-----</option>`;
        for (let j in k_skills) {
            let opt = document.createElement("option");
            opt.value = k_skills[j]["hex"] + "_" + k_skills[j]["cost"];
            opt.text = k_skills[j]["name"] + " cost: " + k_skills[j]["cost"];
            k_skill_sel.appendChild(opt);
        }
        k_skill_sel.addEventListener("change", (event) => {
            document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_0\">-----</option>`;
            document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_0\">-----</option>`;

            let t_values = event.target.value.split('_');
            let k_skill_hex = t_values[0];
            let k_skill_cost = parseInt(t_values[1]);

            k_result["k_skill"][i]["k_skill_hex"] = k_skill_hex;
            k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
            k_result["k_skill"][i]["k_skill_cost"] = k_skill_cost;

            render_armor_cost();
            render_armor_def();

            let k_slot_simple = k_slot_simple_add(k_skill_hex, i);
            k_result["eq_k_slot"] = k_slot_simple.join("");
            render_armor_slot(`${k_result["eq_slot"]} >>> ${k_result["eq_k_slot"]}`);
            // skill delete hex: 0x95
            if (k_skill_hex == "95") {
                sel_armor_original_skill = document.getElementById(`armor_original_skill_${i}`);
                sel_armor_original_skill.innerHTML = `<option value=\"00\">-----</option>`;
                sel_armor_original_skill.disabled = false;
                document.getElementById(`armor_new_skill_${i}`).disabled = true;

                for (let j in k_result["eq_origin_skill"]) {
                    let opt = document.createElement("option");
                    let sname = j;
                    let slv = k_result["eq_origin_skill"][j];
                    opt.text = sname + "+" + slv;
                    let skill_hex = "00";
                    for (let k in skill_list) {
                        // k : skill id
                        if (skill_list[k]["skill_name_japanese"] == sname) {
                            skill_hex = parseInt(k).toString(16).toUpperCase().padStart(2, "0");
                        }
                    }
                    opt.value = `${skill_hex}`;
                    sel_armor_original_skill.appendChild(opt);
                }

                sel_armor_original_skill.addEventListener("change", (event) => {
                    let skill_edit_hex = event.target.value
                    // let skill_name = sel_armor_original_skill.options[sel_armor_original_skill.selectedIndex].text.split("+")[0];
                    let skill_name = document.querySelector(`#armor_original_skill_${i} option:checked`).text.split("+")[0];

                    if (skill_edit_hex == "00") {
                        k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                        k_result["k_skill"][i]["k_skill_name"] = "";
                        k_result["k_skill"][i]["k_skill_name_value"] = 0;
                        render_armor_skill();
                        return;
                    }

                    k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                    k_result["k_skill"][i]["k_skill_name"] = skill_name;
                    k_result["k_skill"][i]["k_skill_name_value"] = -1;
                    render_armor_skill();

                });
                // skill add hex: 0x90 to 0x94
            } else if (SKILL_ADD_HEX.includes(k_skill_hex)) {
                sel_armor_new_skill = document.getElementById(`armor_new_skill_${i}`);
                sel_armor_new_skill.innerHTML = `<option value=\"00\">-----</option>`;
                sel_armor_new_skill.disabled = false;
                let cost = t_values[1];

                for (let k in skill_list) {
                    if (skill_list[k]["skill_cost"] == cost) {
                        let opt = document.createElement("option")
                        let sname = skill_list[k]["skill_name_japanese"];
                        let skill_hex = parseInt(k).toString(16).toUpperCase().padStart(2, "0");;
                        opt.value = `${skill_hex}`;
                        opt.text = sname;
                        sel_armor_new_skill.appendChild(opt);
                    }
                }
                sel_armor_new_skill.addEventListener("change", (event) => {
                    let skill_edit_hex = event.target.value
                    // let skill_name = sel_armor_new_skill.options[sel_armor_new_skill.selectedIndex].text;
                    let skill_name = document.querySelector(`#armor_new_skill_${i} option:checked`).text;
                    if (skill_edit_hex == "00") {
                        k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                        k_result["k_skill"][i]["k_skill_name"] = "";
                        k_result["k_skill"][i]["k_skill_name_value"] = 0;
                        render_armor_skill();
                        return;
                    }

                    if (k_result["eq_skill_set"].size < ARMOR_SKILL_LIMIT) {
                        console.log(skill_name);
                        if (skill_name != "" && skill_name != "-----") {
                            k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                            k_result["k_skill"][i]["k_skill_name"] = skill_name;
                            k_result["k_skill"][i]["k_skill_name_value"] = 1;
                            update_eq_skill();
                            k_result["eq_skill_set"].add(skill_name);
                            if (k_result["eq_skill_set"].has(skill_name)) {
                                k_result["eq_skill"][skill_name] += 1;
                            }

                        }
                    } else if (k_result["eq_skill_set"].size == ARMOR_SKILL_LIMIT) {
                        console.log(skill_name);
                        k_result["k_skill"][i]["k_skill_edit_hex"] = skill_edit_hex;
                        k_result["k_skill"][i]["k_skill_name"] = skill_name;
                        k_result["k_skill"][i]["k_skill_name_value"] = 1;
                        update_eq_skill();
                        if (k_result["eq_skill_set"].has(skill_name)) {
                            k_result["eq_skill"][skill_name] += 1;
                        } else {
                            k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
                            k_result["k_skill"][i]["k_skill_name"] = "";
                            k_result["k_skill"][i]["k_skill_name_value"] = 0;
                            console.log("only 5 unique armor skills");
                            sel_armor_new_skill.options[0].selected = true;
                        }
                    } else {
                        console.log("only 5 unique armor skills");
                        sel_armor_new_skill.options[0].selected = true;
                    }

                    render_armor_skill();
                });
            } else {
                document.getElementById(`armor_original_skill_${i}`).disabled = true;
                document.getElementById(`armor_new_skill_${i}`).disabled = true;
                k_result["k_skill"][i]["k_skill_edit_hex"] = "00";
                k_result["k_skill"][i]["k_skill_name"] = "";
                k_result["k_skill"][i]["k_skill_name_value"] = 0;
            }

            render_armor_skill();
        });
    }
});

function genTemplate() {
    let template_title = `[ 錬成No.${k_result["eq_pos"]}位置： ${k_result["eq_name"]} ]`;
    // k_skill_step start at 0x20, step 8, max 0x50, total 7 items
    let template = "";

    for (i = 32; i < 88; i += 8) {
        k_skill_step = i.toString(16);
        index = i / 8 - 4;
        k_skill_hex = k_result["k_skill"][index]["k_skill_hex"];
        k_skill_edit_hex = k_result["k_skill"][index]["k_skill_edit_hex"];
        let template_block = `
580F0000 ${VERSION_CODE["16.0.0"]}
580F1000 00000088
580F1000 00000028
580F1000 00000010
580F1000 000000${k_result["eq_pos_hex"]}
580F1000 000000A0
580F1000 000000${k_skill_step}
780F0000 00000010
680F0000 00000000 000000${k_skill_hex}
780F0000 00000008
680F0000 00000000 000000${k_skill_edit_hex}`;
        template += template_block;
    }
    document.getElementById("template_result").innerText = "";
    document.getElementById("template_result").innerText = template_title + template + "\n";
}

function copyToClipboard() {
    let content = document.getElementById("template_result").innerText;
    navigator.clipboard.writeText(content);
    document.getElementById("copy_result").innerText = "copied!";
}

function slot_simplify(armor_data) {
    let slot = "";
    for (let i = 4; i > 0; i--) {
        let count = armor_data[`slotLv${i}`];
        for (let j = 0; j < count; j++) {
            slot = slot + i;
        }
    }
    if (slot.length < 3) {
        for (let i = 0; i < 4 - slot.length; i++) {
            slot = slot + "0";
        }
    }
    return slot;
}

function init(armor_id, armor_data) {
    if (armor_data === undefined) return;

    k_result["eq_id"] = armor_id;
    k_result["eq_name"] = armor_data["name"];

    k_result["eq_origin_skill"] = {};
    k_result["eq_skill"] = {};
    k_result["eq_origin_skill_set"].clear();
    k_result["eq_skill_set"].clear();

    for (let i = 0; i < 7; i++) {
        k_result["k_skill"][i] = { k_skill_hex: "00", k_skill_edit_hex: "00", k_skill_name: "", k_skill_name_value: 0, k_skill_cost: 0 };
    }

    for (let i = 0; i < armor_data["skill"].length; i++) {
        let armor_skill = armor_data["skill"][i];
        k_result["eq_origin_skill"][armor_skill["sname"]] = armor_skill["lv"];
        k_result["eq_origin_skill_set"].add(armor_skill["sname"]);
    }

    let eq_position = document.getElementById("armor_pos").value.split("_");
    k_result["eq_pos"] = eq_position[1];
    k_result["eq_pos_hex"] = eq_position[0];

    let slot = slot_simplify(armor_data);
    k_result["eq_slot"] = slot;
    k_result["eq_k_slot"] = slot;

    k_result["eq_cost"] = armor_pool_cost[armor_data["id"]]["cost"];

    k_result["eq_pool_id"] = armor_pool_cost[armor_data["id"]]["pool"];

    k_result["def"]["origin"] = armor_data["bougyo_max"];
    k_result["def_f"]["origin"] = armor_data["def_f"];
    k_result["def_w"]["origin"] = armor_data["def_w"];
    k_result["def_t"]["origin"] = armor_data["def_t"];
    k_result["def_i"]["origin"] = armor_data["def_i"];
    k_result["def_d"]["origin"] = armor_data["def_d"];

    render_armor_slot(slot);
    render_armor_def();
    render_armor_skill();
    render_armor_cost();

    for (let i = 0; i < 7; i++) {
        document.getElementById(`armor_original_skill_${i}`).disabled = true;
        document.getElementById(`armor_original_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
        document.getElementById(`armor_new_skill_${i}`).disabled = true;
        document.getElementById(`armor_new_skill_${i}`).innerHTML = `<option value=\"00_${i}\">-----</option>`;
    }

    document.getElementById("copy_result").innerText = "";
}

function k_slot_simple_add(k_skill_hex, idx) {
    let v = 0;
    // slot add hex: 0x8B to 0x8D
    switch (k_skill_hex) {
        case "8B":
            v = 1;
            break;
        case "8C":
            v = 2;
            break;
        case "8D":
            v = 3;
            break;
        default:
            v = 0;
    }
    // check other k_skill item whether slot add skill
    for (let i = 0; i < 7; i++) {
        if (i != idx) {
            let slot_add_value = k_result["k_skill"][i]["k_skill_hex"];
            switch (slot_add_value) {
                case "8B":
                    v += 1;
                    break;
                case "8C":
                    v += 2;
                    break;
                case "8D":
                    v += 3;
                    break;
                default:
                    v += 0;
            }
        }
    }
    let k_slot_simple = k_result["eq_slot"].split("").map(str => Number(str));
    if (v > 0) {
        for (let i = 0; i < 3; i++) {
            if (v > 0 && k_slot_simple[i] == 0) {
                k_slot_simple[i] = 1;
                v--;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (v > 0 && k_slot_simple[i] < 4) {
                let tmp = k_slot_simple[i];
                if ((tmp + v) > 4) {
                    k_slot_simple[i] = 4;
                    v = tmp + v - 4;
                } else {
                    k_slot_simple[i] = tmp + v;
                    v = 0;
                }
            }
        }
    }
    return k_slot_simple;
}

function update_eq_skill() {
    k_result["eq_skill"] = {}; // {"sname": 0 }
    for (let j = 0; j < 7; j++) {
        let k_skill = k_result["k_skill"][j];
        let sname = k_skill["k_skill_name"];

        if (sname !== "") {
            if (k_skill["k_skill_hex"] == "95" && k_result["eq_origin_skill_set"].has(sname)) {
                if (k_result["eq_skill"][sname] === undefined) {
                    k_result["eq_skill"][sname] = -1;
                } else {
                    k_result["eq_skill"][sname] -= 1;
                }
            } else if (SKILL_ADD_HEX.includes(k_skill["k_skill_hex"])) {
                if (k_result["eq_skill"][sname] === undefined) {
                    k_result["eq_skill"][sname] = 1;
                } else {
                    k_result["eq_skill"][sname] += 1;
                }
            }
        }
    }
    k_result["eq_skill_set"] = new Set(k_result["eq_origin_skill_set"]);
    for (let k in k_result["eq_skill"]) {
        if (!k_result["eq_origin_skill_set"].has(k) && k != "" && k_result["eq_skill_set"].size < ARMOR_SKILL_LIMIT) {
            k_result["eq_skill_set"].add(k);
        }
    }

}

function render_armor_skill() {
    update_eq_skill();

    var div_armor_skill = document.getElementById("armor_skill");
    div_armor_skill.replaceChildren();
    k_result["eq_skill_set"].forEach(entry => {
        let sname = entry;
        let lv = parseInt(k_result["eq_origin_skill"][sname] || 0) + parseInt(k_result["eq_skill"][sname] || 0);
        let skill_text = `${sname}+${lv}`;
        let skill_node = document.createElement("li");
        skill_node.className = "list-group-item";
        skill_node.textContent = skill_text;
        div_armor_skill.append(skill_node);
    });
}

function render_armor_def() {
    let def = 0;
    let def_f = 0;
    let def_w = 0;
    let def_t = 0;
    let def_i = 0;
    let def_d = 0;

    for (let i in k_result["k_skill"]) {
        let k_skill_def_hex = k_result["k_skill"][i]["k_skill_hex"];
        if (DEF_MAP.includes(k_skill_def_hex)) {
            let v_def = k_skill_def_map[k_skill_def_hex];
            let def_value = v_def["pool"][`${k_result["eq_pool_id"]}`];
            switch (v_def["type"]) {
                case "def":
                    def += def_value;
                    break;
                case "def_f":
                    def_f += def_value;
                    break;
                case "def_w":
                    def_w += def_value;
                    break;
                case "def_t":
                    def_t += def_value;
                    break;
                case "def_i":
                    def_i += def_value;
                    break;
                case "def_d":
                    def_d += def_value;
                    break;
                default:
                    console.log("error def type");
            }
        }
    }

    let div_def = document.getElementById("def");
    let div_def_f = document.getElementById("def_f");
    let div_def_w = document.getElementById("def_w");
    let div_def_t = document.getElementById("def_t");
    let div_def_i = document.getElementById("def_i");
    let div_def_d = document.getElementById("def_d");

    k_result["def"]["delta"] = def;
    k_result["def_f"]["delta"] = def_f;
    k_result["def_w"]["delta"] = def_w;
    k_result["def_t"]["delta"] = def_t;
    k_result["def_i"]["delta"] = def_i;
    k_result["def_d"]["delta"] = def_d;

    div_def.textContent = `防御: ${k_result["def"]["origin"] + k_result["def"]["delta"]}(${k_result["def"]["delta"]})`;
    div_def_f.textContent = `火: ${k_result["def_f"]["origin"] + k_result["def_f"]["delta"]}(${k_result["def_f"]["delta"]})`;
    div_def_w.textContent = `水: ${k_result["def_w"]["origin"] + k_result["def_w"]["delta"]}(${k_result["def_w"]["delta"]})`;
    div_def_t.textContent = `雷: ${k_result["def_t"]["origin"] + k_result["def_t"]["delta"]}(${k_result["def_t"]["delta"]})`;
    div_def_i.textContent = `氷: ${k_result["def_i"]["origin"] + k_result["def_i"]["delta"]}(${k_result["def_i"]["delta"]})`;
    div_def_d.textContent = `龍: ${k_result["def_d"]["origin"] + k_result["def_d"]["delta"]}(${k_result["def_d"]["delta"]})`;
}

function render_armor_slot(slot) {
    document.getElementById("armor_slot").innerText = slot;
}

function render_armor_cost() {
    let armor_cost = k_result["eq_cost"];
    for (let i = 0; i < 7; i++) {
        armor_cost -= k_result["k_skill"][i]["k_skill_cost"];
    }
    document.getElementById("armor_cost").textContent = `Armor Cost: ${armor_cost}`;
}

function genExport() {
    let armor_name = k_result["eq_name"];
    let def = k_result["def"]["delta"];
    let def_f = k_result["def_f"]["delta"];
    let def_w = k_result["def_w"]["delta"];
    let def_t = k_result["def_t"]["delta"];
    let def_i = k_result["def_i"]["delta"];
    let def_d = k_result["def_d"]["delta"];
    let k_eq_slot = k_result["eq_k_slot"].split("");
    let slot_delta_list = k_result["eq_slot"].split("").map(function (item, idx) {
        return parseInt(k_eq_slot[idx]) - parseInt(item);
    });
    let k_skill = [];
    for (let i = 0; i < ARMOR_SKILL_LIMIT; i++) {
        let sname = Object.keys(k_result["eq_skill"])[i] || "";
        let lv = k_result["eq_skill"][sname] || "";
        k_skill.push(sname);
        k_skill.push(lv);
    }

    let export_str = `${armor_name},${def},${def_f},${def_w},${def_t},${def_i},${def_d},${slot_delta_list[0]},${slot_delta_list[1]},${slot_delta_list[2]},${k_skill}`
    document.getElementById("template_result").innerText = "";
    document.getElementById("template_result").innerText = export_str;
}

function textImport() {
    let text_import = document.getElementById("ipt_import").value;
    text_import = "冥淵纏鎧イレエピヌ,-18,0,-1,0,0,0,0,2,1,逆恨み,-1,風纏,1,,,,,,";
    let arr_armor = text_import.split(",");

    k_result["eq_name"] = arr_armor[0];
    k_result["def"]["delta"] = arr_armor[1];
    k_result["def_f"]["delta"] = arr_armor[2];
    k_result["def_w"]["delta"] = arr_armor[3];
    k_result["def_t"]["delta"] = arr_armor[4];
    k_result["def_i"]["delta"] = arr_armor[5];
    k_result["def_d"]["delta"] = arr_armor[6];
    k_result["eq_k_slot"] = `${arr_armor[7]}${arr_armor[8]}${arr_armor[9]}`;
    k_result["eq_skill"][arr_armor[10]] = arr_armor[11];
    k_result["eq_skill"][arr_armor[12]] = arr_armor[13];
    k_result["eq_skill"][arr_armor[14]] = arr_armor[15];
    k_result["eq_skill"][arr_armor[16]] = arr_armor[17];
    k_result["eq_skill"][arr_armor[18]] = arr_armor[19];

    update_form();
}

function update_form() {

}

function update_select(select_id, select_text) {
    for (let i = 0; i < select_id.options.length; i++) {
        const opt = select_id.options.item(i);
        if (opt.innerText == select_text) {
            opt.selected = true;
        }
    }
}

function triggerChange(element) {
    let changeEvent = new Event('change');
    element.dispatchEvent(changeEvent);
}