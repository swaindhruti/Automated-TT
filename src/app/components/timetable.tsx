"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Course {
  id: string;
  code: string;
  room?: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

const timeSlots: TimeSlot[] = [
  { start: "08:00", end: "08:55" },
  { start: "09:00", end: "09:55" },
  { start: "10:00", end: "10:55" },
  { start: "11:05", end: "12:00" },
  { start: "12:00", end: "13:15" }, // Lunch slot
  { start: "13:15", end: "14:10" },
  { start: "14:15", end: "15:10" },
  { start: "15:15", end: "16:10" },
  { start: "16:20", end: "17:15" },
  { start: "17:20", end: "18:15" },
];

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const initialTimetable: (Course | null)[][] = [
  [
    { id: "MON-1", code: "ER2251", room: "#" },
    { id: "MON-2", code: "MN2101", room: "#" },
    { id: "MON-3", code: "MN2105", room: "#" },
    { id: "MON-4", code: "CS2011", room: "# LA114" },
    { id: "MON-5", code: "ER2252", room: "#" },
    { id: "MON-6", code: "P-MN2102", room: "# LA115" },
    { id: "MON-7", code: "P-MN2102", room: "# LA115" },
    { id: "MON-8", code: "P-MN2102", room: "# LA115" },
    { id: "MON-9", code: "HS2331", room: "# LA-I (009)" },
    { id: "MON-10", code: "ER2253", room: "#" },
  ],
  [
    { id: "TUE-1", code: "MN2101", room: "#" },
    { id: "TUE-2", code: "P-ER2254", room: "#" },
    { id: "TUE-3", code: "P-ER2254", room: "#" },
    { id: "TUE-4", code: "ER2255", room: "#" },
    { id: "TUE-5", code: "ER2255", room: "#" },
    { id: "TUE-6", code: "P-ER2271", room: "#" },
    { id: "TUE-7", code: "P-ER2271", room: "#" },
    { id: "TUE-8", code: "P-ER2271", room: "#" },
    { id: "TUE-9", code: "HS2331", room: "# LA-I (009)" },
    { id: "TUE-10", code: "ER2256", room: "#" },
  ],
  [
    { id: "WED-1", code: "MN2103", room: "#" },
    { id: "WED-2", code: "MN2107", room: "#" },
    { id: "WED-3", code: "ER2258", room: "#" },
    { id: "WED-4", code: "ER2258", room: "#" },
    { id: "WED-5", code: "ER2258", room: "#" },
    { id: "WED-6", code: "P-CS2014", room: "#" },
    { id: "WED-7", code: "P-CS2014", room: "#" },
    { id: "WED-8", code: "P-CS2014", room: "#" },
    { id: "WED-9", code: "HS2332", room: "# LA-II (010)" },
    { id: "WED-10", code: "ER2259", room: "#" },
  ],
  [
    { id: "THU-1", code: "MN2109", room: "#" },
    { id: "THU-2", code: "P-MN2110", room: "# LA118" },
    { id: "THU-3", code: "P-MN2110", room: "# LA118" },
    { id: "THU-4", code: "P-MN2110", room: "# LA118" },
    { id: "THU-5", code: "ER2261", room: "#" },
    { id: "THU-6", code: "MN2111", room: "#" },
    { id: "THU-7", code: "MN2112", room: "#" },
    { id: "THU-8", code: "CS2016", room: "# LA119" },
    { id: "THU-9", code: "HS2333", room: "# LA-III (011)" },
    { id: "THU-10", code: "ER2262", room: "#" },
  ],
  [
    { id: "FRI-1", code: "MN2113", room: "#" },
    { id: "FRI-2", code: "MN2114", room: "#" },
    { id: "FRI-3", code: "ER2263", room: "#" },
    { id: "FRI-4", code: "CS2017", room: "# LA120" },
    { id: "FRI-5", code: "P-MN2110", room: "#" },
    { id: "FRI-6", code: "P-MN2110", room: "#" },
    { id: "FRI-7", code: "P-MN2110", room: "#" },
    { id: "FRI-8", code: "CS2018", room: "# LA121" },
    { id: "FRI-9", code: "HS2334", room: "# LA-IV (012)" },
    { id: "FRI-10", code: "ER2265", room: "#" },
  ],
];

const Timetable: React.FC = () => {
  const [timetable, setTimetable] =
    useState<(Course | null)[][]>(initialTimetable);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newTimetable = Array.from(timetable);
    const [sourceDay, sourceSlot] = source.droppableId.split("-").map(Number);
    const [destDay, destSlot] = destination.droppableId.split("-").map(Number);

    const [removed] = newTimetable[sourceDay].splice(sourceSlot, 1, null);

    if (newTimetable[destDay][destSlot]) {
      // Find a random empty slot
      const emptySlots = [];
      for (let i = 0; i < newTimetable.length; i++) {
        for (let j = 0; j < newTimetable[i].length; j++) {
          if (newTimetable[i][j] === null) {
            emptySlots.push([i, j]);
          }
        }
      }
      if (emptySlots.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySlots.length);
        const [emptyDay, emptySlot] = emptySlots[randomIndex];
        newTimetable[emptyDay][emptySlot] = newTimetable[destDay][destSlot];
      }
    }

    newTimetable[destDay].splice(destSlot, 1, removed);

    setTimetable(newTimetable);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-yellow-600 bg-indigo-900 text-white p-2">
                PERIOD
                <br />
                DAY
              </th>
              {timeSlots.map((slot, index) => (
                <th
                  key={index}
                  className="border border-yellow-600 bg-indigo-900 text-white p-2 text-sm"
                >
                  {slot.start} hr
                  <br />
                  {slot.end} hr
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={day}>
                <td className="border border-yellow-600 bg-yellow-50 font-semibold p-2">
                  {day}
                </td>
                {Array.from({ length: 10 }).map((_, slotIndex) => (
                  <Droppable
                    key={`${dayIndex}-${slotIndex}`}
                    droppableId={`${dayIndex}-${slotIndex}`}
                    isDropDisabled={slotIndex === 4} // Disable drop for lunch slot
                  >
                    {(provided, snapshot) => (
                      <td
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`border border-yellow-600 p-2 min-w-[100px] h-[80px] relative ${
                          snapshot.isDraggingOver ? "bg-yellow-100" : ""
                        } ${
                          slotIndex === 4
                            ? "bg-red-100"
                            : timetable[dayIndex][slotIndex]?.code.startsWith(
                                "P-"
                              )
                            ? "bg-lime-100"
                            : timetable[dayIndex][slotIndex]
                            ? "bg-blue-100"
                            : "bg-yellow-50"
                        }`}
                      >
                        {slotIndex === 4 ? (
                          <div className="text-center font-medium text-red-600">
                            {Array.from("Lunch").map((char, i) => (
                              <div key={i}>{char}</div>
                            ))}
                          </div>
                        ) : timetable[dayIndex][slotIndex] ? (
                          <Draggable
                            key={timetable[dayIndex][slotIndex]?.id}
                            draggableId={
                              timetable[dayIndex][slotIndex]?.id || ""
                            }
                            index={0}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`text-center font-bold text-black ${
                                  snapshot.isDragging ? "bg-yellow-200" : ""
                                }`}
                              >
                                <div className="font-medium">
                                  {timetable[dayIndex][slotIndex]?.code || "-"}
                                </div>
                                {timetable[dayIndex][slotIndex]?.room && (
                                  <div className="text-red-600 text-sm">
                                    {timetable[dayIndex][slotIndex]?.room}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ) : (
                          <div className="text-center font-medium text-gray-400">
                            Empty
                          </div>
                        )}
                        {provided.placeholder}
                      </td>
                    )}
                  </Droppable>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DragDropContext>
    </div>
  );
};

export default Timetable;
