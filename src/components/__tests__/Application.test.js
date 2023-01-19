import React from "react";

import { queryByText, render, cleanup, waitForElement, fireEvent, getAllByTestId, getByText, getByPlaceholderText, getByAltText, getAllByAltText, wait, queryAllByTestId } from "@testing-library/react";

import Application from "components/Application";
import axios from "__mocks__/axios";


describe("Application", () => {
  afterEach(cleanup);

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });


  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "12pm"));

    const appointment = getAllByTestId(container, "appointment").find(
      apt => queryByText(apt, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = queryAllByTestId(container, "appointment").find(
      apt => queryByText(apt, "Archie Cohen")
    );
    
    await waitForElement(() => fireEvent.click(getByAltText(appointment, "Edit")));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Edited Name" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Edited Name"));
    
    const day = queryAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();    
  });

  it("shows the save error when failing to save an appointment", async () => {
    await waitForElement(() => axios.put.mockRejectedValueOnce());
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = queryAllByTestId(container, "appointment").find(
      apt => queryByText(apt, "Archie Cohen")
    );
    
    await waitForElement(() => fireEvent.click(getByAltText(appointment, "Edit")));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Edited Name" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();     
    
    await waitForElement(() => expect(queryByText(container, "Could not save appointment")).toBeInTheDocument());
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    await waitForElement(() => axios.put.mockRejectedValueOnce());
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = queryAllByTestId(container, "appointment").find(
      apt => queryByText(apt, "Archie Cohen")
    );
    
    await waitForElement(() => fireEvent.click(getByAltText(appointment, "Delete")));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => queryByAltText(appointment, "Could not delete appointment")).toBeInTheDocument;   
  });

});