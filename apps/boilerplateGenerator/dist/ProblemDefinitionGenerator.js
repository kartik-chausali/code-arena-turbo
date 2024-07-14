"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemDefinitionParser = void 0;
class ProblemDefinitionParser {
    constructor() {
        this.problemName = "";
        this.functionName = "";
        this.inputFields = [];
        this.outputFields = [];
    }
    parse(input) {
        const lines = input.split("\n").map((line) => line.trim());
        let currentSection = null;
        lines.forEach((line) => {
            if (line.startsWith("Problem Name:")) {
                this.problemName = this.extractQuotedValue(line);
            }
            else if (line.startsWith("Function Name:")) {
                this.functionName = this.extractValue(line);
            }
            else if (line.startsWith("Input Structure:")) {
                currentSection = "input";
            }
            else if (line.startsWith("Output Structure:")) {
                currentSection = "output";
            }
            else if (line.startsWith("Input Field:")) {
                if (currentSection === "input") {
                    const field = this.extractField(line);
                    if (field)
                        this.inputFields.push(field);
                }
            }
            else if (line.startsWith("Output Field:")) {
                if (currentSection === "output") {
                    const field = this.extractField(line);
                    if (field)
                        this.outputFields.push(field);
                }
            }
        });
    }
    extractQuotedValue(line) {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    }
    extractValue(line) {
        const match = line.match(/: (\w+)$/);
        return match ? match[1] : "";
    }
    extractField(line) {
        const match = line.match(/Field: (\w+(?:<\w+>)?) (\w+)$/);
        return match ? { type: match[1], name: match[2] } : null;
    }
    generateCpp() {
        const inputs = this.inputFields
            .map((field) => `${field.type} ${field.name}`)
            .join(", ");
        return `${this.outputFields[0].type} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }
    generateJs() {
        const inputs = this.inputFields.map((field) => field.name).join(", ");
        return `function ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }
}
exports.ProblemDefinitionParser = ProblemDefinitionParser;
