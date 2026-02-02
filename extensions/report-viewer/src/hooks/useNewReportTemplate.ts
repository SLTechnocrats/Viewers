import { useEffect, useState } from "react";
import { api } from "@/api/api";

const useNewReportTemplate = () => {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [templates, setTemplates] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<number>(0);
  const [activeModuleItem, setActiveModuleItem] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [multiSelectFields, setMultiSelectFields] = useState<any[]>([]);
  const [editorData, setEditorData] = useState("");

  const multiSelectNotSpecified = (item: any) => {
    const { template_field_id, template_module_id, template_section_id } = item;

    // Filter out the object that matches the item's keys
    const updatedMultiSelectFields = multiSelectFields.filter(
      (selectedItem) =>
        selectedItem.template_field_id !== template_field_id ||
        selectedItem.template_module_id !== template_module_id ||
        selectedItem.template_section_id !== template_section_id,
    );

    // Update the state with the filtered array
    setMultiSelectFields(updatedMultiSelectFields);

    console.log(updatedMultiSelectFields, "Updated multiSelectFields");
  };

  const selectHandler = (
    item: { field: string; value: any },
    data: {
      template_field_id: string;
      template_module_id: string;
      template_section_id: string;
    },
  ) => {
    // Prepare the item with additional data keys
    const newItem = {
      ...item,
      template_field_id: data.template_field_id,
      template_module_id: data.template_module_id,
      template_section_id: data.template_section_id,
    };

    // Create a new array based on the current multiSelectFields
    const updatedMultiSelectFields = [...multiSelectFields];

    // Check if the item with the same template_section_id, template_field_id, and template_module_id exists
    const itemIndex = updatedMultiSelectFields.findIndex(
      (selectedItem) =>
        selectedItem.template_field_id === newItem.template_field_id &&
        selectedItem.template_module_id === newItem.template_module_id &&
        selectedItem.template_section_id === newItem.template_section_id,
    );

    if (itemIndex !== -1) {
      // Replace the existing item with the new one
      updatedMultiSelectFields[itemIndex] = newItem;
    } else {
      // Add the item if it does not exist
      updatedMultiSelectFields.push(newItem);
    }

    // Update the state with the new array
    setMultiSelectFields(updatedMultiSelectFields);

    console.log(updatedMultiSelectFields, "Updated multiSelectFields");
  };

  const multiselectHandler = (
    item: { field: string; value: any },
    data: {
      options: { fields: { field: string; value: any }[] };
      template_field_id: string;
      template_module_id: string;
      template_section_id: string;
    },
  ) => {
    const { field } = item;
    // Check if item exists in data.options.fields
    const itemExistsInData = data.options.fields.some(
      (dataItem) => dataItem.field === field && dataItem.value === item.value,
    );

    if (itemExistsInData) {
      // Prepare the item with additional data keys
      const newItem = {
        ...item,
        template_field_id: data.template_field_id,
        template_module_id: data.template_module_id,
        template_section_id: data.template_section_id,
      };

      // Create a new array based on the current multiSelectFields
      const updatedMultiSelectFields = [...multiSelectFields];

      // Check if the item is already in multiSelectFields
      const itemIndex = updatedMultiSelectFields.findIndex(
        (selectedItem) =>
          selectedItem.field === newItem.field &&
          selectedItem.value === newItem.value &&
          selectedItem.template_field_id === newItem.template_field_id &&
          selectedItem.template_module_id === newItem.template_module_id &&
          selectedItem.template_section_id === newItem.template_section_id,
      );

      if (itemIndex !== -1) {
        // Remove the item if it exists
        updatedMultiSelectFields.splice(itemIndex, 1);
      } else {
        // Add the item if it does not exist
        updatedMultiSelectFields.push(newItem);
      }

      // Update the state with the new array
      setMultiSelectFields(updatedMultiSelectFields);

      console.log(updatedMultiSelectFields, "Updated multiSelectFields");
    }
  };

  useEffect(() => {
    multiSelectEditor();
  }, [multiSelectFields]);

  const multiSelectEditor = () => {
    const editorDataMap: Record<number, Record<number, string[]>> = {};

    try {
      const parsedData = JSON.parse(editorData) || {};
      Object.entries(parsedData).forEach(([sectionId, content]) => {
        editorDataMap[+sectionId] = editorDataMap[+sectionId] || {};
        editorDataMap[+sectionId][0] = [content as string];
      });
    } catch (error) {
      console.error("Failed to parse editorData:", error);
    }

    const groupedFields: Record<
      number,
      Record<number, Record<number, string[]>>
    > = {};

    multiSelectFields.forEach((item: any) => {
      const {
        template_section_id,
        template_module_id,
        template_field_id,
        field,
      } = item;

      if (!groupedFields[template_section_id]) {
        groupedFields[template_section_id] = {};
      }

      if (!groupedFields[template_section_id][template_module_id]) {
        groupedFields[template_section_id][template_module_id] = {};
      }

      if (
        !Array.isArray(
          groupedFields[template_section_id][template_module_id][
            template_field_id
          ],
        )
      ) {
        groupedFields[template_section_id][template_module_id][
          template_field_id
        ] = [];
      }

      groupedFields[template_section_id][template_module_id][
        template_field_id
      ].push(field);
    });

    const fieldGroups: Record<
      number,
      Record<number, Record<number, string[]>>
    > = {};
    Object.entries(groupedFields).forEach(([sectionId, moduleGroups]) => {
      fieldGroups[+sectionId] = {};

      Object.entries(moduleGroups).forEach(([moduleId, fieldsGroups]) => {
        fieldGroups[+sectionId][+moduleId] = {};

        Object.entries(fieldsGroups).forEach(([fieldId, fields]) => {
          if (Array.isArray(fields)) {
            fieldGroups[+sectionId][+moduleId][+fieldId] = fields.map((field) =>
              field.split(",").sort().join(","),
            );
          }
        });
      });
    });

    templates.forEach((template) => {
      template.options.fields.forEach((option: any) => {
        const optionFieldStr = option.field.split(",").sort().join(",");

        Object.entries(fieldGroups).forEach(([sectionId, moduleGroups]) => {
          Object.entries(moduleGroups).forEach(([moduleId, fieldsGroups]) => {
            Object.entries(fieldsGroups).forEach(([, group]) => {
              if (Array.isArray(group)) {
                const groupStr = group.sort().join(",");
                if (groupStr === optionFieldStr) {
                  if (!editorDataMap[+sectionId]) {
                    editorDataMap[+sectionId] = {};
                  }
                  if (!Array.isArray(editorDataMap[+sectionId][+moduleId])) {
                    editorDataMap[+sectionId][+moduleId] = [];
                  }
                  editorDataMap[+sectionId][+moduleId].push(
                    option.value.trim(),
                  );
                }
              }
            });
          });
        });
      });
    });

    const sectionTitles: Record<number, string> = sections.reduce(
      (acc, section) => {
        // @ts-ignore
        acc[section.id] = section.title;
        return acc;
      },
      {},
    );

    const finalEditorData = Object.entries(editorDataMap)
      .map(([sectionId, moduleGroups]) => {
        const title = sectionTitles[+sectionId] || `Section ${sectionId}`;
        const moduleContents = Object.entries(moduleGroups)

          .map(([, contents]) => contents.join("<br>"))
          .join("<br>");
        return `<strong style="margin-bottom: 10px">${title}</strong><br><div style="margin-bottom: 5px;"></div>${moduleContents}<div style="margin-bottom: 10px;"></div>`;
      })
      .join("<br><br>");

    setEditorData(finalEditorData);
  };

  const fetchNewReportTemplates = async () => {
    try {
      const { data: apiData } = await api.get(
        api.endpoints.newReportTemplate.getNewReportTemplate,
      );
      const { data, statusCode } = apiData;

      if (statusCode === 200) {
        setTemplates(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSections = async () => {
    try {
      const { data: apiData } = await api.get(
        api.endpoints.newReportTemplate.getSections,
      );
      const { data, statusCode } = apiData;

      if (statusCode === 200) {
        setSections(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const filter = templates?.filter(
      (item) => item.template_section_id === activeSection,
    );
    const uniqueData = filter.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.module_title === item.module_title),
    );
    setActiveModule(0);
    setModules(uniqueData);
  }, [activeSection, templates]);

  useEffect(() => {
    if (modules.length) {
      const filter = templates?.filter(
        (item) => item.module_title === activeModuleItem.module_title,
      );
      setFields(filter);
    }
  }, [activeModuleItem]);

  useEffect(() => {
    if (modules.length === 0) {
      setFields([]);
    }
  }, [modules]);

  useEffect(() => {
    void (async () => {
      await fetchSections();
      await fetchNewReportTemplates();
    })();
  }, []);

  return {
    sections,
    activeSection,
    setActiveSection,
    modules,
    activeModule,
    setActiveModule,
    setActiveModuleItem,
    fields,
    multiselectHandler,
    multiSelectFields,
    multiSelectNotSpecified,
    editorData,
    setEditorData,
    selectHandler,
  };
};

export default useNewReportTemplate;
