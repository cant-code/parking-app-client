import {describe, expect, test} from 'vitest';
import {render, screen, waitFor} from "@testing-library/react";
import {SnackbarContext} from "../../src/Context/snackbar";
import {ERROR, INFO} from "../../src/Utils/Constants";
import CustomizedSnackbars from "../../src/Components/Snackbar";
import {userEvent} from "@testing-library/user-event";
import {act} from "react-dom/test-utils";

const renderComponent = (msg = {
    msg: {msg: "", type: ""},
    setMsg: () => {},
    removeMsg: () => {},
}) => {
    render(
        <SnackbarContext.Provider value={msg}>
            <CustomizedSnackbars />
        </SnackbarContext.Provider>
    );
}

const infobox = "This is an infobox";

describe("Snackbar", () => {

    test("Shows 'Snackbar' when there is an error message", () => {
        renderComponent({msg: {msg: "This is an error", type: ERROR}, removeMsg: () => {}, setMsg: () => {}});

        expect(screen.getByText("This is an error")).toBeDefined();
    });

    test("Shows 'Snackbar' when there is an info message", () => {
        renderComponent({msg: {msg: infobox, type: INFO}, removeMsg: () => {}, setMsg: () => {}});

        expect(screen.getByText(infobox)).toBeDefined();
    });

    test("Close 'Snackbar' when close button clicked", async () => {
        renderComponent({msg: {msg: infobox, type: INFO}, removeMsg: () => {}, setMsg: () => {}});

        expect(screen.getByText(infobox)).toBeDefined();

        let byRole = screen.getByRole("button", { name: "Close" });
        await act(async () => await userEvent.click(byRole));

        await waitFor(() => {
            expect(screen.queryByText(infobox)).toBeNull();
        });
    });

    test("Close 'Snackbar' when 60s pass", async () => {
        renderComponent({msg: {msg: infobox, type: INFO}, removeMsg: () => {}, setMsg: () => {}});

        expect(screen.getByText(infobox)).toBeDefined();

        setTimeout(() => {
            expect(screen.queryByText(infobox)).toBeNull();
        }, 6000);
    });
});